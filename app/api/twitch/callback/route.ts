import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { cookies } from "next/headers";
import { getDb } from "../../../../lib/db";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.discordId) {
    return NextResponse.redirect(new URL("/panel/profil", request.url));
  }

  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("twitch_oauth_state")?.value;
  cookieStore.delete("twitch_oauth_state");

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(new URL("/panel/profil?twitch=error", request.url));
  }

  // Échange du code contre un token
  const tokenRes = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID!,
      client_secret: process.env.TWITCH_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.TWITCH_REDIRECT_URI!,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/panel/profil?twitch=error", request.url));
  }

  const { access_token } = await tokenRes.json();

  // Récupération du profil Twitch
  const userRes = await fetch("https://api.twitch.tv/helix/users", {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Client-Id": process.env.TWITCH_CLIENT_ID!,
    },
  });

  if (!userRes.ok) {
    return NextResponse.redirect(new URL("/panel/profil?twitch=error", request.url));
  }

  const { data } = await userRes.json();
  const twitchUser = data?.[0];

  if (!twitchUser) {
    return NextResponse.redirect(new URL("/panel/profil?twitch=error", request.url));
  }

  await getDb().query(
    `UPDATE web_users SET twitch_id = ?, twitch_username = ?, twitch_avatar = ? WHERE discord_id = ?`,
    [twitchUser.id, twitchUser.login, twitchUser.profile_image_url, session.user.discordId]
  );

  return NextResponse.redirect(new URL("/panel/profil?twitch=ok", request.url));
}
