import Link from "next/link";
import styles from "./HomeHub.module.css";

const CARDS = [
  {
    href: "/regles",
    badge: "Règlement",
    title: "Les règles du serveur",
    description:
      "Un RP sérieux repose sur des règles claires. Consulte le règlement complet avant de candidater.",
    cta: "Lire le règlement",
  },
  {
    href: "/panel/profil",
    badge: "Whitelist",
    title: "Rejoindre Epsilon",
    description:
      "800h FiveM, 18 ans minimum, un background solide. Remplis ta candidature directement depuis ton profil.",
    cta: "Postuler",
  },
  {
    href: "/streamers",
    badge: "Streamers",
    title: "Nos créateurs de contenu",
    description:
      "Découvre les streamers officiels Epsilon et suis leurs aventures en direct sur Twitch.",
    cta: "Voir les streamers",
  },
  {
    href: "#",
    badge: "Discord",
    title: "Rejoins la communauté",
    description:
      "Actualités, annonces, échanges avec le staff et les joueurs, tout se passe sur notre Discord.",
    cta: "Ouvrir Discord",
    external: true,
  },
];

export default function HomeHub() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.badge}>Explorer</span>
          <h2 className={styles.heading}>Tout ce qu&apos;il faut savoir</h2>
        </div>

        <div className={styles.grid}>
          {CARDS.map((card) => {
            const Tag = card.external ? "a" : Link;
            const extra = card.external ? { href: card.href, target: "_blank", rel: "noopener noreferrer" } : { href: card.href };
            return (
              // @ts-expect-error dynamic tag
              <Tag key={card.href} {...extra} className={styles.card}>
                <span className={styles.cardBadge}>{card.badge}</span>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.description}</p>
                <span className={styles.cardCta}>
                  {card.cta}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </span>
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
