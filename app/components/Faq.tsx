"use client";

import { useState } from "react";
import styles from "./Faq.module.css";
import Reveal from "./Reveal";

const FAQ = [
  {
    question: "Comment postuler à la whitelist ?",
    answer:
      "Rends-toi sur la page Whitelist, renseigne tes informations et réponds au questionnaire de candidature.",
  },
  {
    question: "Quand ouvrent les sessions de whitelist ?",
    answer:
      "La première session est annoncée sur le Discord, à partir du 15 mai 2026. Rejoins le serveur Discord pour être notifié.",
  },
  {
    question: "En quoi consiste l'entretien vocal ?",
    answer:
      "Un membre du staff échange avec toi sur Discord pour valider ton profil, ton background et ton personnage.",
  },
  {
    question: "Le serveur est-il ouvert à tous les niveaux ?",
    answer:
      "Oui, tant que tu respectes les conditions de candidature et que tu es prêt à t'investir dans un roleplay sérieux.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={styles.faq} id="faq">
      <div className={styles.inner}>
        <Reveal>
          <span className={styles.badge}>FAQ</span>
          <h2 className={styles.heading}>Questions fréquentes</h2>
        </Reveal>

        <div className={styles.list}>
          {FAQ.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal delay={i * 60} key={item.question}>
                <div className={styles.item}>
                  <button
                    type="button"
                    className={styles.question}
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    {item.question}
                    <span
                      className={`${styles.chevron} ${
                        isOpen ? styles.chevronOpen : ""
                      }`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path
                          d="m6 9 6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={styles.answerWrap}
                    style={{ maxHeight: isOpen ? "200px" : "0px" }}
                  >
                    <p className={styles.answer}>{item.answer}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
