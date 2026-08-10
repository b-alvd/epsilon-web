import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { getDb } from "../../../../lib/db";

export async function POST() {
  const session = await auth();
  if (!session?.user?.discordId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  await getDb().query(
    `UPDATE web_users SET twitch_id = NULL, twitch_username = NULL, twitch_avatar = NULL WHERE discord_id = ?`,
    [session.user.discordId]
  );

  return NextResponse.json({ ok: true });
}
