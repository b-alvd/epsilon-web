import styles from "./Steps.module.css";
import Reveal from "./Reveal";

const STEPS = [
  {
    number: "1",
    title: "Site Epsilon",
    description:
      "Renseigne tes informations et ton background, puis réponds au questionnaire de candidature.",
  },
  {
    number: "2",
    title: "Session whitelist",
    description:
      "Ta candidature est mise en attente jusqu'à l'annonce d'une session de validation par le staff.",
  },
  {
    number: "3",
    title: "Entretien vocal",
    description:
      "Un entretien oral sur Discord avec l'équipe pour valider ton profil, ton background et ton personnage.",
  },
];

const CONDITIONS = ["800 Heures FiveM", "18 Ans Minimum", "Background Complet"];

export default function Steps() {
  return (
    <section className={styles.steps}>
      <div className={styles.inner}>
        <Reveal>
          <span className={styles.badge}>Whitelist</span>
          <h2 className={styles.heading}>Comment rejoindre le serveur</h2>
        </Reveal>

        <div className={styles.list}>
          {STEPS.map((step, i) => (
            <Reveal delay={i * 100} key={step.number}>
              <div className={styles.step}>
                <span className={styles.number}>{step.number}</span>
                <div className={styles.stepBody}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className={styles.conditionsLabel}>Conditions</p>
        </Reveal>
        <div className={styles.conditions}>
          {CONDITIONS.map((condition, i) => (
            <Reveal delay={i * 80} key={condition}>
              <div className={styles.condition}>
                <span className={styles.conditionNumber}>{i + 1}</span>
                <span className={styles.conditionText}>{condition}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <a href="/whitelist" className={styles.cta}>
            Postuler à la whitelist
          </a>
        </Reveal>
      </div>
    </section>
  );
}
