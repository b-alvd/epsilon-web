import type { RowDataPacket } from "mysql2";
import { getDb } from "../db";

export type WhitelistStatus =
  | "draft"
  | "pending"
  | "talk"
  | "accepted"
  | "rejected_quiz"
  | "rejected_talk";

export interface WhitelistApplication extends RowDataPacket {
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
  quiz_seen_ids: number[] | null;
  status: WhitelistStatus;
  created_at: string;
  updated_at: string;
}

export async function getApplication(
  discordId: string
): Promise<WhitelistApplication | null> {
  const [rows] = await getDb().query<WhitelistApplication[]>(
    "SELECT * FROM whitelist_applications WHERE discord_id = ?",
    [discordId]
  );
  return rows[0] ?? null;
}
