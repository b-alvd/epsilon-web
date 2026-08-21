let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAppToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value;

  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID!,
      client_secret: process.env.TWITCH_CLIENT_SECRET!,
      grant_type: "client_credentials",
    }),
  });

  const data = await res.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.value;
}

export interface TwitchStream {
  user_id: string;
  user_login: string;
  user_name: string;
  title: string;
  viewer_count: number;
  thumbnail_url: string;
  game_name: string;
}

export async function getLiveStreams(userIds: string[]): Promise<TwitchStream[]> {
  if (!userIds.length) return [];
  const token = await getAppToken();
  const params = userIds.map((id) => `user_id=${id}`).join("&");
  const res = await fetch(`https://api.twitch.tv/helix/streams?${params}&first=100`, {
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID!,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const data = await res.json();
  return (data.data ?? []) as TwitchStream[];
}
