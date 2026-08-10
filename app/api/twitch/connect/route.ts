import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET() {
  const session = await auth();
  if (!session?.user?.discordId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const state = crypto.randomBytes(16).toString("hex");

  const cookieStore = await cookies();
  cookieStore.set("twitch_oauth_state", state, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 300,
    path: "/",
  });

  const params = new URLSearchParams({
    client_id: process.env.TWITCH_CLIENT_ID!,
    redirect_uri: process.env.TWITCH_REDIRECT_URI!,
    response_type: "code",
    scope: "user:read:email",
    state,
  });

  return NextResponse.redirect(
    `https://id.twitch.tv/oauth2/authorize?${params.toString()}`
  );
}
