import styles from "./Stats.module.css";
import { getDb } from "../../lib/db";
import type { RowDataPacket } from "mysql2";

export const revalidate = 300;

async function fetchStats() {
  try {
    const db = getDb();

    const [[players], [characters], [money], [playtime]] = await Promise.all([
      db.query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM players`),
      db.query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM characters`),
      db.query<RowDataPacket[]>(
        `SELECT (SELECT COALESCE(SUM(quantity),0) FROM player_items WHERE name='money')
              + (SELECT COALESCE(SUM(balance),0) FROM bank_accounts)
              + (SELECT COALESCE(SUM(savings),0) FROM bank_accounts) AS total`
      ),
      db.query<RowDataPacket[]>(`SELECT SUM(total_playtime) AS s FROM players`),
    ]);

    const totalHours = Math.floor((playtime[0].s ?? 0) / 3600);
    const totalMoney = Number(money[0].total ?? 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return [
      { value: String(players[0].n),    label: "Joueurs inscrits" },
      { value: String(characters[0].n), label: "Personnages créés" },
      { value: `${totalMoney} $`,       label: "En circulation" },
      { value: `${totalHours}h`,        label: "De jeu cumulé" },
    ];
  } catch {
    return [];
  }
}

export default async function Stats() {
  const stats = await fetchStats();
  if (!stats.length) return null;

  return (
    <section className={styles.stats}>
      <div className={styles.inner}>
        {stats.map((s) => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.value}>{s.value}</span>
            <span className={styles.label}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
