import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../auth";
import { getDb } from "../../../lib/db";
import type { RowDataPacket } from "mysql2";

interface AppRow extends RowDataPacket {
  id: number;
  status: string;
  twitch_username: string;
  created_at: string;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.discordId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const [rows] = await getDb().query<AppRow[]>(
    `SELECT id, status, twitch_username, created_at FROM streamer_applications WHERE discord_id = ?`,
    [session.user.discordId]
  );

  return NextResponse.json({ application: rows[0] ?? null });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const discordId = session?.user?.discordId;
  if (!discordId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const db = getDb();

  // Vérifie que le Twitch est lié
  const [userRows] = await db.query<(RowDataPacket & { twitch_id: string | null; twitch_username: string | null })[]>(
    `SELECT twitch_id, twitch_username FROM web_users WHERE discord_id = ?`,
    [discordId]
  );
  const user = userRows[0];
  if (!user?.twitch_id) {
    return NextResponse.json({ error: "twitch_not_linked" }, { status: 400 });
  }

  // Pas déjà candidaté
  const [existing] = await db.query<RowDataPacket[]>(
    `SELECT id FROM streamer_applications WHERE discord_id = ?`,
    [discordId]
  );
  if ((existing as RowDataPacket[]).length) {
    return NextResponse.json({ error: "already_applied" }, { status: 409 });
  }

  await db.query(
    `INSERT INTO streamer_applications (discord_id, twitch_id, twitch_username) VALUES (?, ?, ?)`,
    [discordId, user.twitch_id, user.twitch_username]
  );

  return NextResponse.json({ ok: true });
}
