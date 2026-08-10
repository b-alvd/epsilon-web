"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import styles from "./Sidebar.module.css";

function IconUser() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <path d="M9 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-3" />
      <path d="M12 12h4M12 16h4M8 12h.01M8 16h.01" />
    </svg>
  );
}

function IconPerson() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconList() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function IconGamepad() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <circle cx="15" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="17" cy="13" r="1" fill="currentColor" stroke="none" />
      <path d="M3 7h18a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
    </svg>
  );
}

const WHITELIST_ITEMS = [
  { tab: "vous", label: "Vous", Icon: IconUser },
  { tab: "questionnaire", label: "Questionnaire", Icon: IconClipboard },
  { tab: "personnage", label: "Personnage", Icon: IconPerson },
];

const ADMIN_ITEMS = [
  { href: "/panel/admin",         label: "Candidatures", Icon: IconList,   exact: true },
  { href: "/panel/admin/joueurs", label: "Joueurs",      Icon: IconPerson, exact: false },
];

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "vous";
  const { data: session, status } = useSession();
  const [whitelistAccepted, setWhitelistAccepted] = useState(false);
  const isAdmin = session?.user?.isAdmin ?? false;

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/whitelist")
        .then((r) => r.json())
        .then((d) => setWhitelistAccepted(d.application?.status === "accepted"));
    }
  }, [status]);

  const profilActive = pathname === "/panel/profil" && !searchParams.get("tab");

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brand}>
        <Image
          src="/epsilon-logo-nobg.png"
          alt="Epsilon"
          width={26}
          height={26}
          className={styles.brandLogo}
          priority
        />
        <div className={styles.brandText}>
          <span className={styles.brandName}>Epsilon</span>
          <span className={styles.brandSub}>RolePlay</span>
        </div>
      </Link>

      <nav className={styles.nav}>
        <Link
          href="/panel/profil"
          className={`${styles.navLink} ${profilActive ? styles.navLinkActive : ""}`}
        >
          <span className={styles.navIcon}><IconUser /></span>
          Profil
        </Link>
      </nav>

      {!whitelistAccepted && (
        <>
          <div className={styles.sectionLabel}>Whitelist</div>
          <nav className={styles.nav}>
            {WHITELIST_ITEMS.map(({ tab, label, Icon }) => {
              const active = pathname === "/panel/whitelist" && activeTab === tab;
              return (
                <Link
                  key={tab}
                  href={`/panel/whitelist?tab=${tab}`}
                  className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                >
                  <span className={styles.navIcon}><Icon /></span>
                  {label}
                </Link>
              );
            })}
          </nav>
        </>
      )}

      {isAdmin && (
        <>
          <div className={styles.sectionLabel}>
            Administration
          </div>
          <nav className={styles.nav}>
            {ADMIN_ITEMS.map(({ href, label, Icon, exact }) => (
              <Link
                key={href}
                href={href}
                className={`${styles.navLink} ${(exact ? pathname === href : pathname === href || pathname.startsWith(href + "/")) ? styles.navLinkActive : ""}`}
              >
                <span className={styles.navIcon}><Icon /></span>
                {label}
              </Link>
            ))}
          </nav>
        </>
      )}

      {session?.user && (
        <div className={styles.account}>
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "Avatar"}
              width={30}
              height={30}
              className={styles.avatar}
            />
          )}
          <div className={styles.accountInfo}>
            <span className={styles.accountName}>{session.user.name}</span>
            <button type="button" className={styles.logout} onClick={() => signOut()}>
              <IconLogout />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
