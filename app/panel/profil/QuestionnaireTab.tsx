"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Whitelist.module.css";
import type { Application } from "./WhitelistPanel";

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
};

type QuizResult = {
  score: number;
  passed: boolean;
  attempts: number;
  attemptsLeft: number;
  status: string;
};

const TIME_LIMIT_SECONDS = 10 * 60;

export default function QuestionnaireTab({
  application,
  locked,
  maxAttempts,
  onDone,
  onAdvance,
}: {
  application: Application | null;
  locked: boolean;
  maxAttempts: number;
  onDone: () => void;
  onAdvance: () => void;
}) {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const deadlineRef = useRef<number | null>(null);
  const timedOutRef = useRef(false);

  const alreadyPassed = application?.quiz_passed ?? false;
  const attemptsUsed = application?.quiz_attempts ?? 0;
  const attemptsLeft = Math.max(0, maxAttempts - attemptsUsed);
  const attemptsExhausted = !alreadyPassed && attemptsUsed >= maxAttempts;
  const canTake = !locked && !alreadyPassed && !attemptsExhausted && !result;

  useEffect(() => {
    if (!started || !questions) return;

    const interval = setInterval(() => {
      if (!deadlineRef.current) return;
      const remaining = Math.max(
        0,
        Math.round((deadlineRef.current - Date.now()) / 1000)
      );
      setTimeLeft(remaining);

      if (remaining <= 0 && !timedOutRef.current) {
        timedOutRef.current = true;
        clearInterval(interval);
        submit(true);
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, questions]);

  if (locked) {
    return (
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Questionnaire</h2>
        <p className={styles.cardText}>
          Complète d&apos;abord ton profil (heures et âge) pour débloquer le
          questionnaire.
        </p>
      </div>
    );
  }

  if (alreadyPassed) {
    return (
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Questionnaire validé</h2>
        <p className={styles.cardText}>
          Tu as réussi le questionnaire. Passe à l&apos;onglet Personnage.
        </p>
      </div>
    );
  }

  if (attemptsExhausted) {
    return (
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Questionnaire échoué</h2>
        <p className={styles.cardText}>
          Tu as utilisé tes {maxAttempts} tentatives sans obtenir un score
          suffisant.
        </p>
      </div>
    );
  }

  function select(questionId: number, index: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: index }));
  }

  async function startQuiz() {
    setError(null);
    const res = await fetch("/api/whitelist/quiz");
    const data = await res.json();
    setQuestions(data.questions ?? []);
    setAnswers({});
    timedOutRef.current = false;
    deadlineRef.current = Date.now() + TIME_LIMIT_SECONDS * 1000;
    setTimeLeft(TIME_LIMIT_SECONDS);
    setStarted(true);
  }

  async function submit(forced = false) {
    if (!questions) return;

    if (!forced && Object.keys(answers).length < questions.length) {
      setError("Réponds à toutes les questions avant de valider.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/whitelist/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: questions.map((q) => ({
          questionId: q.id,
          selectedIndex: answers[q.id] ?? -1,
        })),
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError("Une erreur est survenue, réessaie.");
      return;
    }

    const data: QuizResult = await res.json();
    setResult(data);
  }

  function continueAfterResult() {
    const passed = result?.passed ?? false;
    setResult(null);
    setAnswers({});
    setQuestions(null);
    setStarted(false);
    onDone();
    if (passed) {
      onAdvance();
    }
  }

  if (result) {
    return (
      <div className={styles.card}>
        <div className={styles.result}>
          <div className={styles.resultScore}>{result.score}%</div>
          <p className={styles.resultLabel}>
            {result.passed
              ? "Questionnaire réussi ! Passe à l'onglet Personnage."
              : result.status === "rejected_quiz"
                ? "Questionnaire échoué. Tu as utilisé tes 3 tentatives."
                : `Questionnaire échoué. Il te reste ${result.attemptsLeft} tentative(s).`}
          </p>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.button}
            onClick={continueAfterResult}
          >
            Continuer
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className={`${styles.card} ${styles.cardNarrow}`}>
        <h2 className={styles.cardTitle}>Questionnaire RP</h2>
        <p className={styles.cardText} style={{ marginBottom: 20 }}>
          Avant de commencer, quelques règles :
        </p>
        <ul className={styles.rulesList}>
          <li>15 questions tirées au hasard, une seule bonne réponse chacune.</li>
          <li>Tu as 10 minutes pour répondre à toutes les questions.</li>
          <li>Le temps écoulé entraîne une soumission automatique (échec).</li>
          <li>Il faut au moins 70% de bonnes réponses pour réussir.</li>
          <li>Maximum {maxAttempts} tentatives au total.</li>
        </ul>
        <p className={styles.attemptsInfo}>
          {attemptsUsed === 0
            ? `${attemptsLeft} tentative(s) disponible(s)`
            : `${attemptsUsed} tentative(s) déjà faite(s), il t'en reste ${attemptsLeft}`}
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.button} onClick={startQuiz}>
            Commencer
          </button>
        </div>
      </div>
    );
  }

  if (!questions) {
    return (
      <div className={styles.card}>
        <p className={styles.cardText}>Chargement du questionnaire...</p>
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeLow = timeLeft <= 60;

  return (
    <div className={styles.card}>
      <div className={`${styles.timerFixed} ${timeLow ? styles.timerLow : ""}`}>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>

      <div className={styles.quizHeader}>
        <div>
          <h2 className={styles.cardTitle}>Questionnaire RP</h2>
          <p className={styles.cardText}>
            {questions.length} questions, réponds du mieux possible.
          </p>
        </div>
        <span className={styles.attemptsBadge}>
          Tentative {attemptsUsed + 1}/{maxAttempts}
        </span>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.quizGrid}>
        {questions.map((q) => (
          <div className={styles.quizQuestion} key={q.id}>
            <p className={styles.quizQuestionText}>{q.question}</p>
            <div className={styles.quizOptions}>
              {q.options.map((option, i) => (
                <button
                  type="button"
                  key={i}
                  className={`${styles.quizOption} ${
                    answers[q.id] === i ? styles.quizOptionSelected : ""
                  }`}
                  onClick={() => select(q.id, i)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.button}
          disabled={submitting}
          onClick={() => submit(false)}
        >
          {submitting ? "Envoi..." : "Valider mes réponses"}
        </button>
      </div>
    </div>
  );
}
