import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { getApplication } from "../../../lib/whitelist/db";

export async function GET() {
  const session = await auth();
  const discordId = session?.user?.discordId;

  if (!discordId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const application = await getApplication(discordId);
  return NextResponse.json({ application });
}
