import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Règlement - Epsilon Roleplay",
  description: "Le règlement complet du serveur Epsilon Roleplay.",
};

const CATEGORIES = [
  {
    title: "Général",
    rules: ["Règle à définir", "Règle à définir", "Règle à définir"],
  },
  {
    title: "Roleplay",
    rules: ["Règle à définir", "Règle à définir", "Règle à définir"],
  },
  {
    title: "Communication",
    rules: ["Règle à définir", "Règle à définir"],
  },
  {
    title: "Sanctions",
    rules: ["Règle à définir", "Règle à définir"],
  },
];

export default function ReglesPage() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.header}>
          <span className={styles.badge}>Règlement</span>
          <h1 className={styles.title}>Les règles d&apos;Epsilon Roleplay</h1>
          <p className={styles.subtitle}>
            À lire et respecter avant de candidater à la whitelist.
          </p>
        </div>

        <div className={styles.content}>
          {CATEGORIES.map((category) => (
            <section className={styles.category} key={category.title}>
              <h2 className={styles.categoryTitle}>{category.title}</h2>
              <ul className={styles.list}>
                {category.rules.map((rule, i) => (
                  <li className={styles.item} key={i}>
                    {rule}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
