import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { getDb } from "../../../../lib/db";
import type { RowDataPacket } from "mysql2";

interface AppRow extends RowDataPacket {
  id: number;
  discord_id: string;
  twitch_id: string;
  twitch_username: string;
  status: string;
  created_at: string;
  discord_name: string | null;
  discord_avatar: string | null;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const [rows] = await getDb().query<AppRow[]>(
    `SELECT sa.*, wu.username AS discord_name, wu.avatar AS discord_avatar
     FROM streamer_applications sa
     LEFT JOIN web_users wu ON wu.discord_id = sa.discord_id
     ORDER BY sa.created_at DESC`
  );

  const counts = { pending: 0, accepted: 0, refused: 0 };
  for (const r of rows) counts[r.status as keyof typeof counts]++;

  return NextResponse.json({ applications: rows, counts });
}
