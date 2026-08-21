import styles from "./HomeSteps.module.css";
import Reveal from "./Reveal";

const STEPS = [
  { n: "1", title: "Candidature en ligne", desc: "Complète ton profil, rédige ton background et réponds au questionnaire depuis le site." },
  { n: "2", title: "Annonce Session whitelist", desc: "Ta candidature est examinée par le staff lors d'une session dédiée." },
  { n: "3", title: "Entretien vocal", desc: "Un échange sur Discord pour valider ton profil, ton personnage et ta motivation." },
];

const CONDITIONS = [
  { label: "800h", sub: "sur FiveM" },
  { label: "18 ans", sub: "minimum" },
  { label: "Background", sub: "complet et cohérent" },
];

export default function HomeSteps() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Reveal>
            <span className={styles.badge}>Whitelist</span>
            <h2 className={styles.heading}>Comment rejoindre le serveur</h2>
            <p className={styles.sub}>Un processus en 3 étapes, conçu pour garantir la qualité du RP.</p>
          </Reveal>

          <div className={styles.conditions}>
            {CONDITIONS.map((c) => (
              <div key={c.label} className={styles.condition}>
                <span className={styles.conditionValue}>{c.label}</span>
                <span className={styles.conditionSub}>{c.sub}</span>
              </div>
            ))}
          </div>

          <Reveal>
            <a href="/panel/profil" className={styles.cta}>
              Postuler maintenant
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </a>
          </Reveal>
        </div>

        <div className={styles.right}>
          {STEPS.map((s) => (
            <div key={s.n} className={styles.step}>
              <span className={styles.stepNum}>{s.n}</span>
              <div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
