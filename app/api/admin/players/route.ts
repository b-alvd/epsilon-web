import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { getDb } from "../../../../lib/db";
import type { RowDataPacket } from "mysql2";

interface PlayerRow extends RowDataPacket {
  id: number;
  discord: string;
  total_playtime: number;
  first_join: string;
  last_join: string;
  discord_name: string | null;
  discord_avatar: string | null;
  char_count: number;
}

interface GlobalStats extends RowDataPacket {
  total_players: number;
  total_characters: number;
  total_playtime: number;
  active_7d: number;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const db = getDb();

    const [players] = await db.query<PlayerRow[]>(
      `SELECT
         p.id,
         p.discord,
         p.total_playtime,
         p.first_join,
         p.last_join,
         ANY_VALUE(wu.username)    AS discord_name,
         ANY_VALUE(wu.avatar)      AS discord_avatar,
         COUNT(c.id)               AS char_count
       FROM players p
       LEFT JOIN web_users wu  ON wu.discord_id = CONVERT(p.discord USING utf8mb4) COLLATE utf8mb4_unicode_ci
       LEFT JOIN characters c  ON c.player_id   = p.id
       GROUP BY p.id, p.discord, p.total_playtime, p.first_join, p.last_join
       ORDER BY p.last_join DESC`
    );

    const [statsRows] = await db.query<GlobalStats[]>(
      `SELECT
         COUNT(DISTINCT p.id)                                                                    AS total_players,
         COUNT(DISTINCT c.id)                                                                    AS total_characters,
         COALESCE(SUM(p.total_playtime), 0)                                                      AS total_playtime,
         COUNT(DISTINCT CASE WHEN p.last_join >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN p.id END) AS active_7d
       FROM players p
       LEFT JOIN characters c ON c.player_id = p.id`
    );

    return NextResponse.json({ players, stats: statsRows[0] });
  } catch (err) {
    console.error("[admin/players] DB error:", err);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }
}
