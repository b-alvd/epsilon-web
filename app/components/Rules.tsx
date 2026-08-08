import styles from "./Rules.module.css";
import Reveal from "./Reveal";

const RULES = [
  "Le roleplay prime sur le gain : pas de comportement méta ou hors-sujet en jeu.",
  "Respect entre joueurs et envers le staff, en toutes circonstances.",
  "Le RDM, le VDM et le fail RP ne sont pas tolérés.",
  "Un personnage cohérent, un background respecté, une histoire qui a du sens.",
];

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
            <Reveal delay={i * 60} key={rule}>
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
