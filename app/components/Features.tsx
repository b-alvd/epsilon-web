import styles from "./Features.module.css";
import Reveal from "./Reveal";
import { IconLayers, IconUsers, IconCoin, IconShield } from "./icons";

const FEATURES = [
  {
    icon: IconLayers,
    title: "Framework sur-mesure",
    description:
      "Un framework développé entièrement en interne, sans ESX ni QBCore, pensé pour la stabilité et le contrôle total du serveur.",
  },
  {
    icon: IconUsers,
    title: "Multi-personnages",
    description:
      "Jusqu'à 3 personnages par joueur, chacun avec sa position, son job, son inventaire et son historique sauvegardés.",
  },
  {
    icon: IconCoin,
    title: "Économie & métiers",
    description:
      "Des métiers légaux et illégaux avec une vraie économie de serveur, pensée pour donner du sens à chaque activité.",
  },
  {
    icon: IconShield,
    title: "Modération & logs",
    description:
      "Chaque action importante du serveur est enregistrée : le staff dispose d'un suivi complet pour une modération juste.",
  },
];

export default function Features() {
  return (
    <section className={styles.features} id="features">
      <div className={styles.inner}>
        <Reveal>
          <span className={styles.badge}>Le serveur</span>
          <h2 className={styles.heading}>Pourquoi rejoindre Epsilon</h2>
        </Reveal>

        <div className={styles.grid}>
          {FEATURES.map((feature, i) => (
            <Reveal delay={i * 80} key={feature.title}>
              <div className={styles.card}>
                <span className={styles.icon}>
                  <feature.icon />
                </span>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDesc}>{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
