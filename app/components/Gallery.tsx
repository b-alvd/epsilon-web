import Image from "next/image";
import styles from "./Gallery.module.css";
import Reveal from "./Reveal";

const TILES = [
  { position: "20% 30%" },
  { position: "60% 50%" },
  { position: "80% 20%" },
  { position: "40% 70%" },
];

export default function Gallery() {
  return (
    <section className={styles.gallery}>
      <div className={styles.inner}>
        <Reveal>
          <span className={styles.badge}>Aperçu</span>
          <h2 className={styles.heading}>Le serveur en images</h2>
        </Reveal>

        <div className={styles.grid}>
          {TILES.map((tile, i) => (
            <Reveal delay={i * 70} key={i}>
              <div className={styles.tile}>
                <Image
                  src="/background.webp"
                  alt=""
                  fill
                  className={styles.tileImg}
                  style={{ objectPosition: tile.position }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
