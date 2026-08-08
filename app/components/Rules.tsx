import styles from "./Rules.module.css";
import Reveal from "./Reveal";

const RULES = ["Règle à définir", "Règle à définir", "Règle à définir", "Règle à définir"];

export default function Rules() {
  return (
    <section className={styles.rules}>
      <div className={styles.inner}>
        <Reveal>
          <span className={styles.badge}>Règles</span>
          <h2 className={styles.heading}>Les bases avant de rejoindre</h2>
        </Reveal>

        <div className={styles.list}>
          {RULES.map((rule, i) => (
            <Reveal delay={i * 60} key={i}>
              <p className={styles.item}>{rule}</p>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <a href="/regles" className={styles.link}>
            Voir le règlement complet →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
