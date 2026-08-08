import styles from "./Team.module.css";
import Reveal from "./Reveal";

const ROLES = [
  { role: "Fondateur", initials: "F" },
  { role: "Développeur", initials: "D" },
  { role: "Responsable staff", initials: "R" },
  { role: "Modérateur", initials: "M" },
];

export default function Team() {
  return (
    <section className={styles.team} id="team">
      <div className={styles.inner}>
        <Reveal>
          <span className={styles.badge}>Équipe</span>
          <h2 className={styles.heading}>Le staff Epsilon</h2>
        </Reveal>

        <div className={styles.grid}>
          {ROLES.map((member, i) => (
            <Reveal delay={i * 80} key={member.role}>
              <div className={styles.card}>
                <span className={styles.avatar}>{member.initials}</span>
                <span className={styles.role}>{member.role}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
