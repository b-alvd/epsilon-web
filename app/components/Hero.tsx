import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Image src="/background.webp" alt="" fill priority className={styles.bg} />
      <div className={styles.overlay} />

      <div className={styles.content}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          Serveur FiveM · Roleplay sérieux
        </div>

        <div className={styles.titleRow}>
          <Image
            src="/epsilon-logo-nobg.png"
            alt=""
            width={60}
            height={60}
            className={styles.mark}
            priority
          />
          <h1 className={styles.title}>psilon Roleplay</h1>
        </div>

        <p className={styles.subtitle}>
          Un univers immersif, une communauté exigeante, un RP qui a du sens.<br />
          Votre histoire commence ici.
        </p>

        <div className={styles.actions}>
          <a href="#" target="_blank" rel="noopener noreferrer" className={styles.primary}>
            Rejoindre le Discord
          </a>
          <a href="/panel/profil" className={styles.secondary}>
            Postuler à la whitelist
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: 6}}>
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </a>
        </div>

        <div className={styles.dates}>
          <span>15 mai 2026 <span className={styles.dateLabel}>Whitelist</span></span>
          <span className={styles.sep} />
          <span>20 mai 2026 <span className={styles.dateLabel}>Ouverture</span></span>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span className={styles.scrollLine} />
      </div>
    </section>
  );
}
