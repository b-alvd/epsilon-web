"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import panel from "../../Panel.module.css";
import styles from "../AdminContent.module.css";

interface App {
  id: number;
  discord_id: string;
  twitch_id: string;
  twitch_username: string;
  status: "pending" | "accepted" | "refused";
  created_at: string;
  discord_name: string | null;
  discord_avatar: string | null;
}

interface Counts { pending: number; accepted: number; refused: number }

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d > 0) return `il y a ${d}j`;
  const h = Math.floor(diff / 3600000);
  if (h > 0) return `il y a ${h}h`;
  return "à l'instant";
}

const STATUS_LABEL: Record<string, string> = { pending: "En attente", accepted: "Accepté", refused: "Refusé" };
const STATUS_BADGE: Record<string, string> = { pending: styles.badgeAmber, accepted: styles.badgeGreen, refused: styles.badgeRed };

export default function StreamersAdminContent() {
  const [apps, setApps] = useState<App[]>([]);
  const [counts, setCounts] = useState<Counts>({ pending: 0, accepted: 0, refused: 0 });
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "refused">("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/streamers")
      .then((r) => r.json())
      .then((d) => { setApps(d.applications ?? []); setCounts(d.counts ?? {}); setLoading(false); });
  }, []);

  async function setStatus(id: number, status: string) {
    const res = await fetch(`/api/admin/streamers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setApps((prev) => prev.map((a) => a.id === id ? { ...a, status: status as App["status"] } : a));
      setCounts((prev) => {
        const old = apps.find((a) => a.id === id)?.status ?? "pending";
        return { ...prev, [old]: prev[old] - 1, [status]: prev[status as keyof Counts] + 1 };
      });
    }
  }

  const filtered = filter === "all" ? apps : apps.filter((a) => a.status === filter);

  return (
    <>
      <div className={styles.statsRow}>
        {([["pending","En attente"], ["accepted","Acceptés"], ["refused","Refusés"]] as const).map(([k, label]) => (
          <div key={k} className={styles.statCard}>
            <span className={styles.statValue}>{counts[k]}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      <div className={styles.filters}>
        {(["all","pending","accepted","refused"] as const).map((f) => (
          <button key={f} type="button"
            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "Tous" : STATUS_LABEL[f]}
            <span className={styles.filterCount}>
              {f === "all" ? apps.length : counts[f]}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.table}>
        {loading && <p className={styles.empty}>Chargement…</p>}
        {!loading && filtered.length === 0 && <p className={styles.empty}>Aucune candidature.</p>}

        {filtered.map((app) => (
          <div key={app.id} className={styles.row}>
            <div className={styles.rowMain} onClick={() => setExpanded(expanded === app.id ? null : app.id)}>
              <div className={styles.rowUser}>
                {app.discord_avatar
                  ? <Image src={app.discord_avatar} alt="" width={32} height={32} className={styles.avatar} />
                  : <div className={styles.avatarPlaceholder} />
                }
                <div>
                  <span className={styles.userName}>{app.discord_name ?? app.discord_id}</span>
                  <span className={styles.userSub}>twitch.tv/{app.twitch_username}</span>
                </div>
              </div>

              <div className={styles.rowMeta}>
                <span className={`${styles.badge} ${STATUS_BADGE[app.status]}`}>{STATUS_LABEL[app.status]}</span>
                <span className={styles.date}>{timeAgo(app.created_at)}</span>
                <span className={styles.chevron}>{expanded === app.id ? "▲" : "▼"}</span>
              </div>
            </div>

            {expanded === app.id && (
              <div className={styles.detail}>
                <div className={styles.detailRow}>
                  <div className={styles.detailBlock}>
                    <span className={styles.detailLabel}>Discord ID</span>
                    <span className={styles.detailValue}>{app.discord_id}</span>
                  </div>
                  <div className={styles.detailBlock}>
                    <span className={styles.detailLabel}>Twitch ID</span>
                    <span className={styles.detailValue}>{app.twitch_id}</span>
                  </div>
                  <div className={styles.detailBlock}>
                    <span className={styles.detailLabel}>Twitch</span>
                    <a
                      href={`https://twitch.tv/${app.twitch_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.detailValue}
                      style={{ color: "var(--purple-400)" }}
                    >
                      twitch.tv/{app.twitch_username}
                    </a>
                  </div>
                </div>

                <div className={styles.actions}>
                  {app.status !== "accepted" && (
                    <button type="button" className={styles.btnPrimary} onClick={() => setStatus(app.id, "accepted")}>
                      Accepter
                    </button>
                  )}
                  {app.status !== "refused" && (
                    <button type="button" className={styles.btnDanger} onClick={() => setStatus(app.id, "refused")}>
                      Refuser
                    </button>
                  )}
                  {app.status !== "pending" && (
                    <button type="button" className={styles.btnPrimary} style={{ background: "transparent", color: "var(--muted)", borderColor: "var(--border)" }} onClick={() => setStatus(app.id, "pending")}>
                      Remettre en attente
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
