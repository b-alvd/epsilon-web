import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { getLiveStreams } from "../../../lib/twitch-api";
import type { RowDataPacket } from "mysql2";

interface StreamerRow extends RowDataPacket {
  discord_id: string;
  twitch_id: string;
  twitch_username: string;
  discord_name: string | null;
  discord_avatar: string | null;
}

export async function GET() {
  const db = getDb();

  const [rows] = await db.query<StreamerRow[]>(
    `SELECT sa.discord_id, sa.twitch_id, sa.twitch_username,
            wu.username AS discord_name, wu.avatar AS discord_avatar
     FROM streamer_applications sa
     LEFT JOIN web_users wu ON wu.discord_id = sa.discord_id
     WHERE sa.status = 'accepted'
     ORDER BY sa.updated_at DESC`
  );

  if (!rows.length) return NextResponse.json({ streamers: [] });

  const liveStreams = await getLiveStreams(rows.map((r) => r.twitch_id));
  const liveMap = new Map(liveStreams.map((s) => [s.user_id, s]));

  const streamers = rows.map((r) => {
    const live = liveMap.get(r.twitch_id);
    const onEpsilon = live?.title?.includes("[Epsilon RP]") ?? false;
    return {
      discord_id:      r.discord_id,
      twitch_id:       r.twitch_id,
      twitch_username: r.twitch_username,
      discord_name:    r.discord_name,
      discord_avatar:  r.discord_avatar,
      live: onEpsilon
        ? {
            title:        live!.title,
            viewer_count: live!.viewer_count,
            thumbnail:    live!.thumbnail_url.replace("{width}", "440").replace("{height}", "248"),
            game:         live!.game_name,
          }
        : null,
    };
  });

  return NextResponse.json({ streamers });
}
