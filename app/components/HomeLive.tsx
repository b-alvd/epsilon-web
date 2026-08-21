import Link from "next/link";
import Image from "next/image";
import styles from "./HomeLive.module.css";

export const revalidate = 60;

interface LiveStreamer {
  twitch_username: string;
  discord_name: string | null;
  discord_avatar: string | null;
  live: {
    title: string;
    viewer_count: number;
    thumbnail: string;
    game: string;
  };
}

async function getLiveStreamers(): Promise<LiveStreamer[]> {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/streamers`, { cache: "no-store" });
    const data = await res.json();
    return (data.streamers ?? []).filter((s: { live: unknown }) => s.live);
  } catch {
    return [];
  }
}

export default async function HomeLive() {
  const streamers = await getLiveStreamers();
  if (!streamers.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot} />
            <span className={styles.liveLabel}>En live sur Epsilon</span>
          </div>
          <Link href="/streamers" className={styles.seeAll}>
            Voir tous les streamers
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </Link>
        </div>

        <div className={styles.grid}>
          {streamers.slice(0, 3).map((s) => (
            <a
              key={s.twitch_username}
              href={`https://twitch.tv/${s.twitch_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <div className={styles.thumb}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.live.thumbnail} alt={s.live.title} className={styles.thumbImg} />
                <span className={styles.chip}>LIVE</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardUser}>
                  {s.discord_avatar && (
                    <Image src={s.discord_avatar} alt="" width={28} height={28} className={styles.avatar} />
                  )}
                  <span className={styles.username}>{s.twitch_username}</span>
                </div>
                <p className={styles.title}>{s.live.title}</p>
                <span className={styles.viewers}>{s.live.viewer_count.toLocaleString("fr-FR")} viewers</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
