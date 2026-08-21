import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/regles", label: "Règlement" },
  { href: "/streamers", label: "Streamers" },
  { href: "/panel/profil", label: "Mon profil" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <span className={styles.word}>
            <Image
              src="/epsilon-logo-nobg.png"
              alt="E"
              width={18}
              height={18}
              className={styles.eLogo}
            />
            psilon
          </span>
          <span className={styles.rp}>RolePlay</span>
        </Link>

        <nav className={styles.nav}>
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Discord
          </a>
        </nav>

        <p className={styles.copy}>© Epsilon Roleplay 2026 · Développé par b_alvd</p>
      </div>
    </footer>
  );
}
