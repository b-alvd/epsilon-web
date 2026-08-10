import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { getDb } from "../../../../lib/db";
import { getApplication } from "../../../../lib/whitelist/db";

export async function POST(request: Request) {
  const session = await auth();
  const discordId = session?.user?.discordId;

  if (!discordId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const application = await getApplication(discordId);

  if (!application?.quiz_passed) {
    return NextResponse.json({ error: "quiz_required" }, { status: 400 });
  }

  const body = await request.json();
  const { firstname, lastname, characterAge, background } = body as {
    firstname?: string;
    lastname?: string;
    characterAge?: number;
    background?: string;
  };

  if (
    typeof firstname !== "string" ||
    typeof lastname !== "string" ||
    typeof characterAge !== "number" ||
    typeof background !== "string" ||
    !firstname.trim() ||
    !lastname.trim() ||
    characterAge < 0 ||
    characterAge > 120 ||
    background.trim().length < 20
  ) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  await getDb().query(
    `UPDATE whitelist_applications
     SET character_firstname = ?, character_lastname = ?, character_age = ?,
         character_background = ?, status = 'pending'
     WHERE discord_id = ?`,
    [firstname.trim(), lastname.trim(), characterAge, background.trim(), discordId]
  );

  return NextResponse.json({ ok: true });
}
