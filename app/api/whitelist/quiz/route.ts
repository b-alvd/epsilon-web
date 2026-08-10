import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { getDb } from "../../../../lib/db";
import { getApplication } from "../../../../lib/whitelist/db";
import { QUESTIONS } from "../../../../lib/whitelist/questions";

const QUESTIONS_PER_ATTEMPT = 15;
const PASS_THRESHOLD = 0.7;
const MAX_ATTEMPTS = 3;

function pickQuestions(seenIds: number[]) {
  const unseen = QUESTIONS.filter((q) => !seenIds.includes(q.id));
  const pool = unseen.length >= QUESTIONS_PER_ATTEMPT ? unseen : QUESTIONS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, QUESTIONS_PER_ATTEMPT);
}

export async function GET() {
  const session = await auth();
  const discordId = session?.user?.discordId;

  if (!discordId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const application = await getApplication(discordId);

  if (!application || application.playtime_hours == null || application.age == null) {
    return NextResponse.json({ error: "profile_required" }, { status: 400 });
  }

  if (application.status !== "draft" || application.quiz_attempts >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: "quiz_unavailable" }, { status: 400 });
  }

  const seenIds = application.quiz_seen_ids ?? [];
  const questions = pickQuestions(seenIds).map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options,
  }));

  return NextResponse.json({
    questions,
    attemptsLeft: MAX_ATTEMPTS - application.quiz_attempts,
  });
}

export async function POST(request: Request) {
  const session = await auth();
  const discordId = session?.user?.discordId;

  if (!discordId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const application = await getApplication(discordId);

  if (!application || application.playtime_hours == null || application.age == null) {
    return NextResponse.json({ error: "profile_required" }, { status: 400 });
  }

  if (application.status !== "draft" || application.quiz_attempts >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: "quiz_unavailable" }, { status: 400 });
  }

  const body = await request.json();
  const { answers } = body as {
    answers?: { questionId: number; selectedIndex: number }[];
  };

  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  let correct = 0;
  const answeredIds: number[] = [];

  for (const answer of answers) {
    const question = QUESTIONS.find((q) => q.id === answer.questionId);
    if (!question) continue;
    answeredIds.push(question.id);
    if (question.correctIndex === answer.selectedIndex) {
      correct += 1;
    }
  }

  const score = Math.round((correct / answeredIds.length) * 100);
  const passed = correct / answeredIds.length >= PASS_THRESHOLD;
  const attempts = application.quiz_attempts + 1;

  const seenIds = Array.from(
    new Set([...(application.quiz_seen_ids ?? []), ...answeredIds])
  );

  const nextStatus =
    !passed && attempts >= MAX_ATTEMPTS ? "rejected_quiz" : "draft";

  await getDb().query(
    `UPDATE whitelist_applications
     SET quiz_attempts = ?, quiz_score = ?, quiz_passed = ?, quiz_seen_ids = ?, status = ?
     WHERE discord_id = ?`,
    [attempts, score, passed, JSON.stringify(seenIds), nextStatus, discordId]
  );

  return NextResponse.json({
    score,
    passed,
    attempts,
    attemptsLeft: MAX_ATTEMPTS - attempts,
    status: nextStatus,
  });
}
