"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import panel from "../../../Panel.module.css";
import styles from "./PlayerDetail.module.css";

interface PlayerInfo {
  player_id: number;
  total_playtime: number;
  first_join: string;
  last_join: string;
  discord_name: string | null;
  discord_avatar: string | null;
  whitelist_status: string | null;
}

interface Character {
  id: number;
  firstname: string;
  lastname: string;
  dob: string;
  gender: number;
  cash: number;
  slot: number;
  last_played: string;
  balance: number | null;
  savings: number | null;
  credit_score: number | null;
  job_label: string | null;
  job_color: string | null;
}

const WL_LABEL: Record<string, string> = {
  draft:         "Brouillon",
  pending:       "En attente",
  talk:          "Entretien",
  accepted:      "Accepté",
  rejected_quiz: "Quiz refusé",
  rejected_talk: "Entretien refusé",
};

const WL_CLASS: Record<string, string> = {
  draft:         styles.badgeGray,
  pending:       styles.badgeAmber,
  talk:          styles.badgeBlue,
  accepted:      styles.badgeGreen,
  rejected_quiz: styles.badgeRed,
  rejected_talk: styles.badgeRed,
};

function formatPlaytime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

function calcAge(dob: string) {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) age--;
  return age;
}

function fmt(n: number) {
  return n.toLocaleString("fr-FR");
}

export default function PlayerDetail({ discordId }: { discordId: string }) {
  const [player, setPlayer] = useState<PlayerInfo | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [identifiers, setIdentifiers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/players/${discordId}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setPlayer(data.player);
        setCharacters(data.characters);
        setIdentifiers(data.identifiers ?? {});
        setLoading(false);
      });
  }, [discordId]);

  if (loading) return null;

  if (notFound) {
    return (
      <div className={panel.card} style={{ maxWidth: 400 }}>
        <p className={panel.cardTitle}>Joueur introuvable</p>
        <p className={panel.cardText}>Aucun joueur FiveM avec cet ID Discord.</p>
      </div>
    );
  }

  if (!player) return null;

  return (
    <>
      {/* ── Header joueur ── */}
      <div className={styles.playerHeader}>
        {player.discord_avatar ? (
          <Image
            src={player.discord_avatar}
            alt={player.discord_name ?? "Avatar"}
            width={56}
            height={56}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarFallback} />
        )}
        <div>
          <h2 className={styles.playerName}>{player.discord_name ?? discordId}</h2>
          <p className={styles.playerSub}>{discordId}</p>
        </div>
        {player.whitelist_status && (
          <span className={`${styles.badge} ${WL_CLASS[player.whitelist_status] ?? styles.badgeGray}`}>
            WL — {WL_LABEL[player.whitelist_status] ?? player.whitelist_status}
          </span>
        )}
      </div>

      {/* ── Stats joueur ── */}
      <div className={styles.statsRow}>
        {([
          [formatPlaytime(player.total_playtime), "Temps de jeu"],
          [characters.length,                      "Personnages"],
          [formatDate(player.first_join),           "Première connexion"],
          [formatDate(player.last_join),            "Dernière connexion"],
        ] as [string | number, string][]).map(([val, label]) => (
          <div key={label} className={styles.statCard}>
            <span className={styles.statValue}>{val}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Identifiants ── */}
      {Object.keys(identifiers).length > 0 && (
        <div className={styles.identBlock}>
          <p className={styles.identTitle}>Identifiants</p>
          <div className={styles.identGrid}>
            {Object.entries(identifiers).map(([key, value]) => (
              <div key={key} className={styles.identItem}>
                <span className={styles.identLabel}>{key}</span>
                <span className={styles.identValue}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Personnages ── */}
      <p className={panel.sectionLabel} style={{ marginBottom: 12 }}>
        Personnages ({characters.length})
      </p>

      {characters.length === 0 ? (
        <p style={{ fontSize: 13, color: "var(--dim)" }}>Aucun personnage créé.</p>
      ) : (
        <div className={styles.chars}>
          {characters.map((c) => (
            <div key={c.id} className={styles.charCard}>
              {/* Nom + slot */}
              <div className={styles.charHeader}>
                <span className={styles.charName}>{c.firstname} {c.lastname}</span>
                <span className={styles.charSlot}>Slot {c.slot}</span>
              </div>

              <div className={styles.charMeta}>
                <span>{c.gender === 0 ? "Homme" : "Femme"}</span>
                <span>·</span>
                <span>{calcAge(c.dob)} ans</span>
                {c.job_label && (
                  <>
                    <span>·</span>
                    <span
                      className={styles.jobBadge}
                      style={{ background: c.job_color ? `${c.job_color}22` : undefined, color: c.job_color ?? undefined, borderColor: c.job_color ? `${c.job_color}44` : undefined }}
                    >
                      {c.job_label}
                    </span>
                  </>
                )}
              </div>

              <div className={styles.charDivider} />

              {/* Finances */}
              <div className={styles.charFinances}>
                <div className={styles.financeItem}>
                  <span className={styles.financeLabel}>Liquide</span>
                  <span className={styles.financeValue}>{fmt(c.cash)} $</span>
                </div>
                {c.balance != null && (
                  <div className={styles.financeItem}>
                    <span className={styles.financeLabel}>Compte courant</span>
                    <span className={styles.financeValue}>{fmt(c.balance)} $</span>
                  </div>
                )}
                {c.savings != null && (
                  <div className={styles.financeItem}>
                    <span className={styles.financeLabel}>Épargne</span>
                    <span className={styles.financeValue}>{fmt(c.savings)} $</span>
                  </div>
                )}
                {c.credit_score != null && (
                  <div className={styles.financeItem}>
                    <span className={styles.financeLabel}>Score crédit</span>
                    <span className={`${styles.financeValue} ${c.credit_score >= 700 ? styles.scoreGreen : c.credit_score >= 500 ? styles.scoreAmber : styles.scoreRed}`}>
                      {c.credit_score}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.charFooter}>
                <span>Dernière connexion : {formatDate(c.last_played)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
