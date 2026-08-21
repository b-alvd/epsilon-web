import Link from "next/link";
import styles from "./HomeReglement.module.css";
import Reveal from "./Reveal";

export default function HomeReglement() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <Reveal>
          <div className={styles.banner}>
            <div className={styles.bannerLeft}>
              <span className={styles.badge}>Règlement</span>
              <h2 className={styles.heading}>À lire avant de candidater</h2>
              <p className={styles.sub}>
                Le règlement d'Epsilon est court, précis, et non négociable.
                Sa lecture et son respect sont obligatoires pour tout joueur souhaitant rejoindre le serveur.
                Aucune exception ne sera accordée pour cause de méconnaissance des règles.
              </p>
            </div>
            <Link href="/regles" className={styles.cta}>
              Lire le règlement
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
