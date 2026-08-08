import styles from "./Stats.module.css";
import Reveal from "./Reveal";

const STATS = [
  { value: "6", label: "Services publics" },
  { value: "10", label: "Groupes illégaux" },
  { value: "23", label: "Entreprises légales" },
  { value: "3", label: "Personnages par joueur" },
];

export default function Stats() {
  return (
    <section className={styles.stats}>
      <div className={styles.inner}>
        {STATS.map((stat, i) => (
          <Reveal delay={i * 80} key={stat.label}>
            <div className={styles.stat}>
              <span className={styles.value}>{stat.value}</span>
              <span className={styles.label}>{stat.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
