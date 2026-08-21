import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { getDb } from "../../../../../lib/db";
import type { RowDataPacket } from "mysql2";

interface PlayerRow extends RowDataPacket {
  player_id: number;
  total_playtime: number;
  first_join: string;
  last_join: string;
  discord_name: string | null;
  discord_avatar: string | null;
  whitelist_status: string | null;
}

interface CharRow extends RowDataPacket {
  id: number;
  firstname: string;
  lastname: string;
  dob: string;
  gender: number;
  cash: number;
  slot: number;
  last_played: string;
  balance: number | null;
  savings: number | null;
  credit_score: number | null;
  job_label: string | null;
  job_color: string | null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ discordId: string }> }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { discordId } = await params;
  const db = getDb();

  const [playerRows] = await db.query<PlayerRow[]>(
    `SELECT
       p.*,
       p.id            AS player_id,
       wu.username     AS discord_name,
       wu.avatar       AS discord_avatar,
       wa.status       AS whitelist_status
     FROM players p
     LEFT JOIN web_users wu ON wu.discord_id = CONVERT(p.discord USING utf8mb4) COLLATE utf8mb4_unicode_ci
     LEFT JOIN whitelist_applications wa ON wa.discord_id = CONVERT(p.discord USING utf8mb4) COLLATE utf8mb4_unicode_ci
     WHERE p.discord = ?`,
    [discordId]
  );

  if (!playerRows.length) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const [characters] = await db.query<CharRow[]>(
    `SELECT
       c.id,
       c.firstname,
       c.lastname,
       c.dob,
       c.gender,
       COALESCE(i.quantity, 0)  AS cash,
       c.slot,
       c.last_played,
       b.balance,
       b.savings,
       b.credit_score,
       j.label  AS job_label,
       j.color  AS job_color
     FROM characters c
     LEFT JOIN bank_accounts b  ON b.character_id = c.id
     LEFT JOIN job_sessions js  ON js.character_id = c.id AND js.is_active = 1
     LEFT JOIN jobs j           ON j.id = js.job_id
     LEFT JOIN player_items i   ON i.character_id = c.id AND i.name = 'money'
     WHERE c.player_id = ?
     ORDER BY c.last_played DESC`,
    [playerRows[0].player_id]
  );

  const raw = playerRows[0] as Record<string, unknown>;
  const IDENTIFIER_KEYS = ["discord", "license", "license2", "steam", "xbl", "live", "fivem"];
  const identifiers: Record<string, string> = { uid: String(raw.id) };
  for (const key of IDENTIFIER_KEYS) {
    if (raw[key] && typeof raw[key] === "string") {
      identifiers[key] = raw[key] as string;
    }
  }

  return NextResponse.json({ player: playerRows[0], discordId, characters, identifiers });
}
