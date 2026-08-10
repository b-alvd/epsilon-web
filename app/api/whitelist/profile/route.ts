import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { getDb } from "../../../../lib/db";

export async function POST(request: Request) {
  const session = await auth();
  const discordId = session?.user?.discordId;

  if (!discordId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { playtimeHours, age } = body as {
    playtimeHours?: number;
    age?: number;
  };

  if (
    typeof playtimeHours !== "number" ||
    typeof age !== "number" ||
    age < 13 ||
    age > 120 ||
    playtimeHours < 0
  ) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  await getDb().query(
    `INSERT INTO whitelist_applications (discord_id, playtime_hours, age)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE
       playtime_hours = VALUES(playtime_hours),
       age = VALUES(age)`,
    [discordId, playtimeHours, age]
  );

  return NextResponse.json({ ok: true });
}
