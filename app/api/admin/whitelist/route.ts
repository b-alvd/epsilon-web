import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { getDb } from "../../../../lib/db";
import type { RowDataPacket } from "mysql2";

interface ApplicationRow extends RowDataPacket {
  id: number;
  discord_id: string;
  playtime_hours: number | null;
  age: number | null;
  character_firstname: string | null;
  character_lastname: string | null;
  character_age: number | null;
  character_background: string | null;
  quiz_attempts: number;
  quiz_score: number | null;
  quiz_passed: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  discord_name: string | null;
  discord_avatar: string | null;
}

interface CountRow extends RowDataPacket {
  status: string;
  count: number;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const db = getDb();

  const [applications] = await db.query<ApplicationRow[]>(
    `SELECT wa.*,
            wu.username AS discord_name,
            wu.avatar   AS discord_avatar
     FROM whitelist_applications wa
     LEFT JOIN web_users wu ON wu.discord_id = wa.discord_id
     ORDER BY wa.updated_at DESC`
  );

  const [counts] = await db.query<CountRow[]>(
    `SELECT status, COUNT(*) AS count FROM whitelist_applications GROUP BY status`
  );

  const stats = { total: 0, draft: 0, pending: 0, talk: 0, accepted: 0, rejected_quiz: 0, rejected_talk: 0 };
  for (const row of counts) {
    const key = row.status as keyof typeof stats;
    if (key in stats) stats[key] = Number(row.count);
    stats.total += Number(row.count);
  }

  return NextResponse.json({ applications, stats });
}
