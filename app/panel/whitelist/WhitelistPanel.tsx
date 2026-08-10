"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./Whitelist.module.css";
import VousTab from "./VousTab";
import QuestionnaireTab from "./QuestionnaireTab";
import PersonnageTab from "./PersonnageTab";

export type Application = {
  playtime_hours: number | null;
  age: number | null;
  character_firstname: string | null;
  character_lastname: string | null;
  character_age: number | null;
  character_background: string | null;
  quiz_attempts: number;
  quiz_passed: boolean;
  status:
    | "draft"
    | "pending"
    | "talk"
    | "accepted"
    | "rejected_quiz"
    | "rejected_talk";
};

const MAX_ATTEMPTS = 3;

export type TabId = "vous" | "questionnaire" | "personnage";

export default function WhitelistPanel() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as TabId | null) ?? "vous";
  const [application, setApplication] = useState<Application | null | undefined>(undefined);

  const load = useCallback(() => {
    fetch("/api/whitelist")
      .then((res) => res.json())
      .then((data) => setApplication(data.application ?? null));
  }, []);

  const goTo = useCallback(
    (next: TabId) => router.push(`/panel/whitelist?tab=${next}`),
    [router]
  );

  useEffect(() => {
    if (sessionStatus === "authenticated") load();
  }, [sessionStatus, load]);

  if (sessionStatus === "loading" || (sessionStatus === "authenticated" && application === undefined)) {
    return (
      <div className={styles.card}>
        <p className={styles.cardText}>Chargement...</p>
      </div>
    );
  }

  if (sessionStatus !== "authenticated") {
    return (
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Connecte-toi pour candidater</h2>
        <p className={styles.cardText} style={{ marginBottom: 24 }}>
          La candidature whitelist nécessite une connexion via Discord.
        </p>
        <button type="button" className={styles.button} onClick={() => signIn("discord")}>
          Se connecter avec Discord
        </button>
      </div>
    );
  }

  if (!session?.user?.inGuild) {
    return (
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Rejoins le Discord d&apos;abord</h2>
        <p className={styles.cardText} style={{ marginBottom: 24 }}>
          Tu dois être membre du serveur Discord Epsilon Roleplay pour candidater à la whitelist.
        </p>
        <div className={styles.actions}>
          <a href="#" target="_blank" rel="noopener noreferrer" className={styles.button}>
            Rejoindre le Discord
          </a>
          <button type="button" className={styles.buttonSecondary} onClick={() => signIn("discord")}>
            J&apos;ai rejoint, réessayer
          </button>
        </div>
      </div>
    );
  }

  const profileComplete = application?.playtime_hours != null && application?.age != null;
  const quizPassed = application?.quiz_passed ?? false;
  const quizLocked = !profileComplete;
  const personnageLocked = !quizPassed;
  const submitted = application?.status !== undefined && application?.status !== "draft";

  return (
    <div>
      {submitted && <StatusBanner application={application as Application} />}

      {tab === "vous" && (
        <VousTab
          application={application ?? null}
          readOnly={submitted}
          onSaved={() => { load(); goTo("questionnaire"); }}
        />
      )}
      {tab === "questionnaire" && (
        <QuestionnaireTab
          application={application ?? null}
          locked={quizLocked}
          maxAttempts={MAX_ATTEMPTS}
          onDone={load}
          onAdvance={() => goTo("personnage")}
        />
      )}
      {tab === "personnage" && (
        <PersonnageTab
          application={application ?? null}
          locked={personnageLocked}
          readOnly={submitted}
          onSaved={load}
        />
      )}
    </div>
  );
}

function StatusBanner({ application }: { application: Application }) {
  const map = {
    pending: {
      color: "var(--purple-500)",
      title: "En attente de validation",
      text: "Ta candidature est en cours d'examen par le staff.",
    },
    talk: {
      color: "var(--purple-500)",
      title: "Entretien vocal",
      text: "Ta candidature a été présélectionnée. Rejoins le Discord pour planifier ton entretien vocal.",
      showDiscordLink: true,
    },
    accepted: {
      color: "var(--green)",
      title: "Candidature acceptée",
      text: "Bienvenue sur Epsilon Roleplay ! Tu peux rejoindre le serveur.",
    },
    rejected_quiz: {
      color: "var(--red)",
      title: "Candidature refusée",
      text: "Le questionnaire n'a pas été validé après 3 tentatives.",
    },
    rejected_talk: {
      color: "var(--red)",
      title: "Candidature refusée",
      text: "Ta candidature n'a pas été retenue à l'issue de l'entretien vocal.",
    },
  } as const;

  const info = map[application.status as keyof typeof map];
  if (!info) return null;

  return (
    <div className={styles.banner}>
      <span className={styles.statusDot} style={{ background: info.color }} />
      <div>
        <p className={styles.bannerTitle}>{info.title}</p>
        <p className={styles.bannerText}>{info.text}</p>
        {"showDiscordLink" in info && info.showDiscordLink && (
          <a href="#" target="_blank" rel="noopener noreferrer" className={styles.bannerLink}>
            Rejoindre le Discord
          </a>
        )}
      </div>
    </div>
  );
}
