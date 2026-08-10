"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import panel from "../../Panel.module.css";
import styles from "./PlayersContent.module.css";

interface Player {
  id: number;
  discord: string;
  total_playtime: number;
  first_join: string;
  last_join: string;
  discord_name: string | null;
  discord_avatar: string | null;
  char_count: number;
}

interface GlobalStats {
  total_players: number;
  total_characters: number;
  total_playtime: number;
  active_7d: number;
}

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

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days}j`;
  if (days < 30) return `Il y a ${Math.floor(days / 7)}sem`;
  return formatDate(iso);
}

export default function PlayersContent() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/players");
    if (!res.ok) { setLoading(false); return; }
    const data = await res.json();
    setPlayers(data.players ?? []);
    setStats(data.stats ?? null);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = players.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (p.discord_name ?? p.discord).toLowerCase().includes(q);
  });

  if (loading) return null;

  return (
    <>
      {/* ── Stats globales ── */}
      {stats && (
        <div className={styles.statsRow}>
          {([
            [stats.total_players,    "Joueurs inscrits"],
            [stats.total_characters, "Personnages créés"],
            [stats.active_7d,        "Actifs 7 derniers jours"],
            [formatPlaytime(stats.total_playtime), "Temps de jeu cumulé"],
          ] as [string | number, string][]).map(([val, label]) => (
            <div key={label} className={styles.statCard}>
              <span className={styles.statValue}>{val}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Recherche ── */}
      <div className={styles.searchWrap}>
        <input
          type="text"
          className={styles.search}
          placeholder="Rechercher par pseudo Discord..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className={styles.searchCount}>{filtered.length} joueur{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* ── Table ── */}
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>Joueur</span>
          <span>Personnages</span>
          <span>Temps de jeu</span>
          <span>Dernière connexion</span>
          <span>Membre depuis</span>
          <span />
        </div>

        {filtered.length === 0 ? (
          <p className={styles.empty}>Aucun joueur trouvé.</p>
        ) : filtered.map((p) => (
          <div key={p.id} className={styles.tableRow}>
            <div className={styles.playerCell}>
              {p.discord_avatar ? (
                <Image
                  src={p.discord_avatar}
                  alt={p.discord_name ?? "Avatar"}
                  width={30}
                  height={30}
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarFallback} />
              )}
              <div>
                <span className={styles.playerName}>{p.discord_name ?? p.discord}</span>
                <span className={styles.playerSub}>{p.discord}</span>
              </div>
            </div>

            <span className={styles.cell}>{p.char_count}</span>
            <span className={styles.cell}>{formatPlaytime(p.total_playtime)}</span>
            <span className={styles.cell}>{timeAgo(p.last_join)}</span>
            <span className={styles.cell}>{formatDate(p.first_join)}</span>

            <Link href={`/panel/admin/joueurs/${p.discord}`} className={styles.viewBtn}>
              Voir →
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
