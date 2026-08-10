import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { getDb } from "../../../../lib/db";
import type { RowDataPacket } from "mysql2";

interface TwitchRow extends RowDataPacket {
  twitch_id: string | null;
  twitch_username: string | null;
  twitch_avatar: string | null;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.discordId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const [rows] = await getDb().query<TwitchRow[]>(
    `SELECT twitch_id, twitch_username, twitch_avatar FROM web_users WHERE discord_id = ?`,
    [session.user.discordId]
  );

  const row = rows[0];
  return NextResponse.json({
    twitch: row?.twitch_id
      ? { id: row.twitch_id, username: row.twitch_username, avatar: row.twitch_avatar }
      : null,
  });
}
