"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import panel from "../Panel.module.css";
import styles from "./ProfilContent.module.css";

const DISMISS_KEY = "epsilon-wl-banner-dismissed";

type TwitchData = { id: string; username: string; avatar: string | null } | null;

interface Character {
  char_id: number;
  firstname: string;
  lastname: string;
  dob: string;
  gender: number;
  cash: number;
  slot: number;
  last_played: string;
  balance: number | null;
  savings: number | null;
  job_label: string | null;
  job_color: string | null;
}

function calcAge(dob: string) {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return age;
}

function fmt(n: number) {
  return n.toLocaleString("fr-FR");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function ProfilContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [whitelistStatus, setWhitelistStatus] = useState<string | null | undefined>(undefined);
  const [bannerDismissed, setBannerDismissed] = useState(true);
  const [twitch, setTwitch] = useState<TwitchData>(undefined as unknown as TwitchData);
  const [twitchLoading, setTwitchLoading] = useState(false);
  const [twitchFeedback, setTwitchFeedback] = useState<"ok" | "error" | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [identifiers, setIdentifiers] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    setBannerDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    const param = searchParams.get("twitch");
    if (param === "ok" || param === "error") setTwitchFeedback(param);
  }, [searchParams]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/whitelist")
        .then((r) => r.json())
        .then((d) => setWhitelistStatus(d.application?.status ?? null));
      fetch("/api/twitch/me")
        .then((r) => r.json())
        .then((d) => setTwitch(d.twitch));
      fetch("/api/player")
        .then((r) => r.json())
        .then((d) => {
          setCharacters(d.characters ?? []);
          if (d.identifiers) setIdentifiers(d.identifiers);
        });
    }
  }, [status]);

  async function disconnectTwitch() {
    setTwitchLoading(true);
    await fetch("/api/twitch/disconnect", { method: "POST" });
    setTwitch(null);
    setTwitchFeedback(null);
    setTwitchLoading(false);
  }

  function dismissBanner() {
    localStorage.setItem(DISMISS_KEY, "1");
    setBannerDismissed(true);
  }

  if (status === "loading") return null;

  if (status !== "authenticated") {
    return (
      <div className={panel.grid}>
        <div className={panel.card}>
          <p className={panel.cardTitle}>Non connecté</p>
          <p className={panel.cardText} style={{ marginBottom: 20 }}>
            Connecte-toi avec Discord pour accéder à ton profil.
          </p>
          <button type="button" className={styles.button} onClick={() => signIn("discord")}>
            Se connecter avec Discord
          </button>
        </div>
      </div>
    );
  }

  const { name, email, image, inGuild } = session.user;
  const isAccepted = whitelistStatus === "accepted";
  const twitchLoaded = twitch !== (undefined as unknown as TwitchData);

  return (
    <div className={panel.grid}>
      {/* ── Carte Discord ── */}
      <div className={panel.card}>
        <p className={panel.sectionLabel}>Compte Discord</p>

        <div className={styles.identity}>
          {image && (
            <Image src={image} alt={name ?? "Avatar"} width={52} height={52} className={styles.avatar} />
          )}
          <div className={styles.identityInfo}>
            <span className={styles.username}>{name}</span>
            {email && <span className={styles.email}>{email}</span>}
          </div>
        </div>

        <div className={panel.divider} />

        <div className={styles.row}>
          <span className={styles.rowLabel}>Serveur Discord</span>
          <span className={`${styles.badge} ${inGuild ? styles.badgeGreen : styles.badgeRed}`}>
            <span className={styles.dot} />
            {inGuild ? "Rejoint" : "Non rejoint"}
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {!inGuild && (
          <a href="#" target="_blank" rel="noopener noreferrer" className={styles.joinLink}>
            Rejoindre le Discord →
          </a>
        )}
      </div>

      {/* ── Carte Twitch ── */}
      {twitchLoaded && (
        <div className={panel.card}>
          <p className={panel.sectionLabel}>Compte Twitch</p>

          {twitch ? (
            <>
              <div className={styles.identity}>
                {twitch.avatar && (
                  <Image src={twitch.avatar} alt={twitch.username} width={52} height={52} className={styles.avatar} />
                )}
                <div className={styles.identityInfo}>
                  <span className={styles.username}>{twitch.username}</span>
                  <span className={styles.email}>twitch.tv/{twitch.username}</span>
                </div>
              </div>

              {twitchFeedback === "ok" && (
                <p className={styles.feedbackOk}>Compte Twitch connecté avec succès.</p>
              )}

              <div style={{ flex: 1 }} />
              <div className={panel.divider} />

              <button type="button" className={styles.buttonDanger} onClick={disconnectTwitch} disabled={twitchLoading}>
                {twitchLoading ? "Déconnexion..." : "Déconnecter Twitch"}
              </button>
            </>
          ) : (
            <>
              <p className={panel.cardText} style={{ marginBottom: 16 }}>
                Lie ton compte Twitch pour apparaître sur la page streamers.
              </p>

              {twitchFeedback === "error" && (
                <p className={styles.feedbackError}>La connexion Twitch a échoué. Réessaie.</p>
              )}

              <div style={{ flex: 1 }} />

              <a href="/api/twitch/connect" className={styles.buttonTwitch}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
                </svg>
                Connecter Twitch
              </a>
            </>
          )}
        </div>
      )}

      {/* ── Encart whitelist acceptée ── */}
      {isAccepted && !bannerDismissed && (
        <div className={`${styles.wlCard} ${panel.cardFull}`}>
          <div className={styles.wlTop}>
            <div className={styles.wlTopLeft}>
              <span className={styles.wlDot} />
              <span className={styles.wlLabel}>Whitelist</span>
            </div>
            <button type="button" className={styles.wlDismiss} onClick={dismissBanner} title="Masquer">✕</button>
          </div>
          <p className={styles.wlTitle}>Tu es whitelisté</p>
          <p className={styles.wlText}>Bienvenue sur Epsilon Roleplay. Connecte-toi en jeu avec ton personnage.</p>
        </div>
      )}

      {/* ── Identifiants ── */}
      {identifiers && Object.keys(identifiers).length > 0 && (
        <div className={panel.card}>
          <p className={panel.sectionLabel}>Identifiants</p>
          <div className={styles.identGrid}>
            {Object.entries(identifiers).map(([key, value]) => (
              <div key={key} className={styles.identItem}>
                <span className={styles.identKey}>{key}</span>
                <span className={styles.identVal}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Mes personnages ── */}
      {characters.length > 0 && (
        <div className={`${panel.card} ${panel.cardFull}`}>
          <p className={panel.sectionLabel}>Mes personnages</p>

          <div className={styles.charGrid}>
            {characters.map((c) => (
              <div key={c.char_id} className={styles.charCard}>
                <div className={styles.charTop}>
                  <div>
                    <span className={styles.charName}>{c.firstname} {c.lastname}</span>
                    <span className={styles.charMeta}>
                      {c.gender === 0 ? "Homme" : "Femme"} · {calcAge(c.dob)} ans
                    </span>
                  </div>
                  <span className={styles.charSlot}>Slot {c.slot}</span>
                </div>

                {c.job_label && (
                  <span
                    className={styles.jobBadge}
                    style={{
                      background: c.job_color ? `${c.job_color}22` : undefined,
                      color: c.job_color ?? undefined,
                      borderColor: c.job_color ? `${c.job_color}44` : undefined,
                    }}
                  >
                    {c.job_label}
                  </span>
                )}

                <div className={styles.charDivider} />

                <div className={styles.charFinances}>
                  <div className={styles.finItem}>
                    <span className={styles.finLabel}>Liquide</span>
                    <span className={styles.finValue}>{fmt(c.cash)} $</span>
                  </div>
                  {c.balance != null && (
                    <div className={styles.finItem}>
                      <span className={styles.finLabel}>Banque</span>
                      <span className={styles.finValue}>{fmt(c.balance)} $</span>
                    </div>
                  )}
                  {c.savings != null && (
                    <div className={styles.finItem}>
                      <span className={styles.finLabel}>Épargne</span>
                      <span className={styles.finValue}>{fmt(c.savings)} $</span>
                    </div>
                  )}
                </div>

                <span className={styles.charDate}>Dernière co. : {formatDate(c.last_played)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
