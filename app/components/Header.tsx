import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";
import AuthButton from "./AuthButton";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/regles", label: "Règles" },
  { href: "/streamers", label: "Streamers" },
];

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link href="/" className={styles.brand}>
            <span className={styles.word}>
              <Image
                src="/epsilon-logo-nobg.png"
                alt="E"
                width={22}
                height={22}
                className={styles.eLogo}
                priority
              />
              psilon
            </span>
            <span className={styles.rp}>RolePlay</span>
          </Link>

          <nav className={styles.nav}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.navLink}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <AuthButton />
      </div>
    </header>
  );
}
