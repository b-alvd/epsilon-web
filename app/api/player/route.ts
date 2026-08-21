import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { getDb } from "../../../lib/db";
import type { RowDataPacket } from "mysql2";

interface PlayerRow extends RowDataPacket {
  player_id: number;
  total_playtime: number;
  first_join: string;
  last_join: string;
}

interface CharRow extends RowDataPacket {
  char_id: number;
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

export async function GET() {
  const session = await auth();
  const discordId = session?.user?.discordId;

  if (!discordId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const db = getDb();

  const [playerRows] = await db.query<PlayerRow[]>(
    `SELECT * FROM players WHERE discord = ?`,
    [discordId]
  );

  if (!playerRows.length) {
    return NextResponse.json({ player: null, characters: [] });
  }

  const raw = playerRows[0] as Record<string, unknown>;
  const player = {
    player_id:      raw.id,
    total_playtime: raw.total_playtime,
    first_join:     raw.first_join,
    last_join:      raw.last_join,
  } as PlayerRow;

  const IDENTIFIER_KEYS = ["discord", "license", "license2", "steam", "xbl", "live", "fivem"];
  const identifiers: Record<string, string> = { uid: String(raw.id) };
  for (const key of IDENTIFIER_KEYS) {
    if (raw[key] && typeof raw[key] === "string") {
      identifiers[key] = raw[key] as string;
    }
  }

  const [characters] = await db.query<CharRow[]>(
    `SELECT
       c.id            AS char_id,
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
       j.label         AS job_label,
       j.color         AS job_color
     FROM characters c
     LEFT JOIN bank_accounts b  ON b.character_id = c.id
     LEFT JOIN job_sessions js  ON js.character_id = c.id AND js.is_active = 1
     LEFT JOIN jobs j           ON j.id = js.job_id
     LEFT JOIN player_items i   ON i.character_id = c.id AND i.name = 'money'
     WHERE c.player_id = ?
     ORDER BY c.last_played DESC`,
    [player.player_id]
  );

  return NextResponse.json({ player, characters, identifiers });
}
