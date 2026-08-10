"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "./AuthButton.module.css";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className={styles.placeholder} />;
  }

  if (session?.user) {
    return (
      <div className={styles.wrap}>
        <Link href="/profil" className={styles.account}>
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "Avatar"}
              width={26}
              height={26}
              className={styles.avatar}
            />
          )}
          <span className={styles.name}>{session.user.name}</span>
        </Link>
        <button
          type="button"
          className={styles.logout}
          onClick={() => signOut()}
        >
          Déconnexion
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={styles.cta}
      onClick={() => signIn("discord")}
    >
      Se connecter
    </button>
  );
}
