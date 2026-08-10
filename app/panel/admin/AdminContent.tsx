"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import panel from "../Panel.module.css";
import styles from "./AdminContent.module.css";

type Status = "draft" | "pending" | "talk" | "accepted" | "rejected_quiz" | "rejected_talk";

interface Application {
  id: number;
  discord_id: string;
  discord_name: string | null;
  discord_avatar: string | null;
  playtime_hours: number | null;
  age: number | null;
  character_firstname: string | null;
  character_lastname: string | null;
  character_age: number | null;
  character_background: string | null;
  quiz_attempts: number;
  quiz_score: number | null;
  quiz_passed: boolean;
  status: Status;
  created_at: string;
  updated_at: string;
}

interface Stats {
  total: number;
  draft: number;
  pending: number;
  talk: number;
  accepted: number;
  rejected_quiz: number;
  rejected_talk: number;
}

const STATUS_LABEL: Record<Status, string> = {
  draft:         "Brouillon",
  pending:       "En attente",
  talk:          "Entretien",
  accepted:      "Accepté",
  rejected_quiz: "Quiz refusé",
  rejected_talk: "Entretien refusé",
};

const STATUS_CLASS: Record<Status, string> = {
  draft:         styles.badgeGray,
  pending:       styles.badgeAmber,
  talk:          styles.badgeBlue,
  accepted:      styles.badgeGreen,
  rejected_quiz: styles.badgeRed,
  rejected_talk: styles.badgeRed,
};

const FILTERS: { key: Status | "all"; label: string }[] = [
  { key: "all",          label: "Tous" },
  { key: "pending",      label: "En attente" },
  { key: "talk",         label: "Entretien" },
  { key: "accepted",     label: "Acceptés" },
  { key: "rejected_quiz", label: "Quiz refusés" },
  { key: "rejected_talk", label: "Entretien refusés" },
  { key: "draft",        label: "Brouillons" },
];

const ACTIONS: Record<Status, { status: Status; label: string; danger?: boolean }[]> = {
  draft:         [{ status: "pending", label: "Marquer en attente" }],
  pending:       [{ status: "talk", label: "Convoquer en entretien" }, { status: "rejected_quiz", label: "Refuser", danger: true }],
  talk:          [{ status: "accepted", label: "Accepter" }, { status: "rejected_talk", label: "Refuser", danger: true }],
  rejected_quiz: [{ status: "draft", label: "Remettre en brouillon" }],
  rejected_talk: [{ status: "draft", label: "Remettre en brouillon" }],
  accepted:      [],
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function AdminContent() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filter, setFilter] = useState<Status | "all">("pending");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [forbidden, setForbidden] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/whitelist");
    if (res.status === 403) { setForbidden(true); return; }
    const data = await res.json();
    setApplications(data.applications);
    setStats(data.stats);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function applyAction(id: number, status: Status) {
    setActionLoading(id);
    await fetch(`/api/admin/whitelist/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
    setActionLoading(null);
  }

  if (forbidden) {
    return (
      <div className={panel.card} style={{ maxWidth: 400 }}>
        <p className={panel.cardTitle}>Accès refusé</p>
        <p className={panel.cardText}>Tu n&apos;as pas les droits pour accéder à cette page.</p>
      </div>
    );
  }

  if (loading) return null;

  const filtered = filter === "all" ? applications : applications.filter((a) => a.status === filter);

  return (
    <>
      {/* ── Stats ── */}
      {stats && (
        <div className={styles.statsRow}>
          {([
            ["total",         "Total"],
            ["pending",       "En attente"],
            ["talk",          "Entretien"],
            ["accepted",      "Acceptés"],
            ["rejected_quiz", "Quiz refusés"],
            ["rejected_talk", "Entretien refusés"],
          ] as [keyof Stats, string][]).map(([key, label]) => (
            <div key={key} className={styles.statCard}>
              <span className={styles.statValue}>{stats[key]}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Filtres ── */}
      <div className={styles.filters}>
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`${styles.filterBtn} ${filter === key ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter(key)}
          >
            {label}
            {stats && key !== "all" && (
              <span className={styles.filterCount}>{stats[key as keyof Stats]}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      {filtered.length === 0 ? (
        <p className={styles.empty}>Aucune candidature pour ce filtre.</p>
      ) : (
        <div className={styles.table}>
          {filtered.map((app) => (
            <div key={app.id} className={styles.row}>
              {/* ── Ligne principale ── */}
              <div
                className={styles.rowMain}
                onClick={() => setExpanded(expanded === app.id ? null : app.id)}
              >
                <div className={styles.rowUser}>
                  {app.discord_avatar ? (
                    <Image
                      src={app.discord_avatar!}
                      alt={app.discord_name ?? "Avatar"}
                      width={32}
                      height={32}
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder} />
                  )}
                  <div>
                    <span className={styles.userName}>{app.discord_name ?? app.discord_id}</span>
                    <span className={styles.userSub}>
                      {app.playtime_hours != null ? `${app.playtime_hours}h` : "—"}
                      {" · "}
                      {app.age != null ? `${app.age} ans` : "—"}
                    </span>
                  </div>
                </div>

                <div className={styles.rowMeta}>
                  {app.quiz_score != null && (
                    <span className={styles.quizScore}>{app.quiz_score}/20</span>
                  )}
                  <span className={styles.date}>{formatDate(app.updated_at)}</span>
                  <span className={`${styles.badge} ${STATUS_CLASS[app.status]}`}>
                    {STATUS_LABEL[app.status]}
                  </span>
                  <span className={styles.chevron}>{expanded === app.id ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* ── Détail expandable ── */}
              {expanded === app.id && (
                <div className={styles.detail}>
                  {(app.character_firstname || app.character_lastname) && (
                    <div className={styles.detailBlock}>
                      <span className={styles.detailLabel}>Personnage</span>
                      <span className={styles.detailValue}>
                        {app.character_firstname} {app.character_lastname}
                        {app.character_age ? `, ${app.character_age} ans` : ""}
                      </span>
                    </div>
                  )}

                  {app.character_background && (
                    <div className={styles.detailBlock}>
                      <span className={styles.detailLabel}>Background</span>
                      <p className={styles.detailText}>{app.character_background}</p>
                    </div>
                  )}

                  <div className={styles.detailRow}>
                    <div className={styles.detailBlock}>
                      <span className={styles.detailLabel}>Tentatives quiz</span>
                      <span className={styles.detailValue}>{app.quiz_attempts}</span>
                    </div>
                    <div className={styles.detailBlock}>
                      <span className={styles.detailLabel}>Candidature créée</span>
                      <span className={styles.detailValue}>{formatDate(app.created_at)}</span>
                    </div>
                    <div className={styles.detailBlock}>
                      <span className={styles.detailLabel}>ID Discord</span>
                      <span className={styles.detailValue}>{app.discord_id}</span>
                    </div>
                  </div>

                  {ACTIONS[app.status].length > 0 && (
                    <div className={styles.actions}>
                      {ACTIONS[app.status].map((action) => (
                        <button
                          key={action.status}
                          type="button"
                          className={action.danger ? styles.btnDanger : styles.btnPrimary}
                          disabled={actionLoading === app.id}
                          onClick={() => applyAction(app.id, action.status)}
                        >
                          {actionLoading === app.id ? "..." : action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
