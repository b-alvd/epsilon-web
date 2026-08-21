import Link from "next/link";
import Image from "next/image";
import styles from "./HomeStreamers.module.css";

interface LiveStreamer {
  twitch_username: string;
  discord_name: string | null;
  discord_avatar: string | null;
  live: { title: string; viewer_count: number; thumbnail: string } | null;
}

async function getStreamers(): Promise<LiveStreamer[]> {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/streamers`, { cache: "no-store" });
    const data = await res.json();
    return data.streamers ?? [];
  } catch {
    return [];
  }
}

export default async function HomeStreamers() {
  const all = await getStreamers();
  const live = all.filter((s) => s.live);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.badge}>Streamers</span>
            <h2 className={styles.heading}>Nos créateurs de contenu</h2>
            <p className={styles.sub}>
              Des joueurs qui partagent leur expérience sur Epsilon en direct.
              Rejoins la liste des streamers affiliés et partage ton aventure.
            </p>
          </div>
          <Link href="/streamers" className={styles.seeAll}>
            Voir tous les streamers
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </Link>
        </div>

        {/* ── Live ou vide ── */}
        {live.length > 0 ? (
          <div className={styles.grid}>
            {live.slice(0, 3).map((s) => (
              <a
                key={s.twitch_username}
                href={`https://twitch.tv/${s.twitch_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.card}
              >
                <div className={styles.thumb}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.live!.thumbnail} alt="" className={styles.thumbImg} />
                  <span className={styles.liveChip}>
                    <span className={styles.liveDot} />
                    LIVE
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardUser}>
                    {s.discord_avatar && (
                      <Image src={s.discord_avatar} alt="" width={28} height={28} className={styles.avatar} />
                    )}
                    <span className={styles.username}>{s.twitch_username}</span>
                  </div>
                  <p className={styles.cardTitle}>{s.live!.title}</p>
                  <span className={styles.viewers}>{s.live!.viewer_count.toLocaleString("fr-FR")} viewers</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyDot} />
            <span className={styles.emptyText}>Aucun streamer en live sur Epsilon pour le moment.</span>
          </div>
        )}

        {/* ── Devenir streamer ── */}
        <div className={styles.affiliate}>
          <div className={styles.affiliateLeft}>
            <span className={styles.affiliateTitle}>Devenir streamer affilié</span>
            <p className={styles.affiliateDesc}>
              Tu stream sur FiveM ? Lie ton compte Twitch depuis ton profil et soumets ta candidature.
              Si elle est acceptée, tu apparais sur cette page et en live quand tu joues sur Epsilon.
            </p>
          </div>
          <Link href="/panel/profil" className={styles.affiliateCta}>
            Candidater
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
