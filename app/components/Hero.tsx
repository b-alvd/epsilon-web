import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Image
        src="/background.webp"
        alt=""
        fill
        priority
        className={styles.bg}
      />
      <div className={styles.overlay} />

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <Image
            src="/epsilon-logo-nobg.png"
            alt=""
            width={56}
            height={56}
            className={styles.mark}
            priority
          />
          <h1 className={styles.title}>psilon Roleplay</h1>
        </div>

        <p className={styles.subtitle}>
          Votre histoire, vos choix, votre destin.
        </p>

        <div className={styles.actions}>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primary}
          >
            Rejoindre le Discord
          </a>
          <a href="/profil" className={styles.secondary}>
            Postuler à la whitelist
          </a>
        </div>

        <div className={styles.dates}>
          <span>
            15 mai 2026 <span className={styles.dateLabel}>Whitelist</span>
          </span>
          <span className={styles.dot} />
          <span>
            20 mai 2026 <span className={styles.dateLabel}>Ouverture</span>
          </span>
        </div>
      </div>
    </section>
  );
}
