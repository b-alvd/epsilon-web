import type { Metadata } from "next";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Streamers - Epsilon Roleplay",
  description: "Les streamers officiels d'Epsilon Roleplay.",
};

export const revalidate = 60;

interface Streamer {
  discord_id: string;
  twitch_id: string;
  twitch_username: string;
  discord_name: string | null;
  discord_avatar: string | null;
  live: {
    title: string;
    viewer_count: number;
    thumbnail: string;
    game: string;
  } | null;
}

async function getStreamers(): Promise<Streamer[]> {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/streamers`, { cache: "no-store" });
    const data = await res.json();
    return data.streamers ?? [];
  } catch {
    return [];
  }
}

export default async function StreamersPage() {
  const streamers = await getStreamers();
  const live = streamers.filter((s) => s.live);
  const offline = streamers.filter((s) => !s.live);

  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.header}>
          <span className={styles.badge}>Communauté</span>
          <h1 className={styles.title}>Streamers Epsilon</h1>
          <p className={styles.subtitle}>
            Les créateurs de contenu officiels du serveur. Suis-les sur Twitch !
          </p>
        </div>

        {streamers.length === 0 ? (
          <p className={styles.empty}>Aucun streamer pour le moment.</p>
        ) : (
          <>
            {live.length > 0 && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <span className={styles.liveDot} />
                  <span className={styles.sectionLabel}>En live sur Epsilon</span>
                </div>
                <div className={styles.grid}>
                  {live.map((s) => <StreamerCard key={s.discord_id} streamer={s} />)}
                </div>
              </section>
            )}

            {offline.length > 0 && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionLabel}>Streamers</span>
                </div>
                <div className={styles.grid}>
                  {offline.map((s) => <StreamerCard key={s.discord_id} streamer={s} />)}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

function StreamerCard({ streamer: s }: { streamer: Streamer }) {
  return (
    <a
      href={`https://twitch.tv/${s.twitch_username}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.card} ${s.live ? styles.cardLive : ""}`}
    >
      {s.live && (
        <div className={styles.thumbnail}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.live.thumbnail} alt={s.live.title} className={styles.thumbnailImg} />
          <span className={styles.liveChip}>EN LIVE</span>
        </div>
      )}

      <div className={styles.cardBody}>
        <div className={styles.cardUser}>
          {s.discord_avatar && (
            <Image src={s.discord_avatar} alt={s.twitch_username} width={40} height={40} className={styles.avatar} />
          )}
          <div className={styles.cardInfo}>
            <span className={styles.cardName}>{s.twitch_username}</span>
            {s.discord_name && <span className={styles.cardSub}>{s.discord_name}</span>}
          </div>
        </div>

        {s.live && (
          <div className={styles.liveInfo}>
            <p className={styles.liveTitle}>{s.live.title}</p>
            <div className={styles.liveMeta}>
              <span className={styles.viewers}>{s.live.viewer_count.toLocaleString("fr-FR")} viewers</span>
              {s.live.game && <span className={styles.game}>{s.live.game}</span>}
            </div>
          </div>
        )}
      </div>
    </a>
  );
}
