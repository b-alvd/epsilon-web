"use client";

import { useState } from "react";
import styles from "./Whitelist.module.css";
import type { Application } from "./WhitelistPanel";

export default function PersonnageTab({
  application,
  locked,
  readOnly,
  onSaved,
}: {
  application: Application | null;
  locked: boolean;
  readOnly: boolean;
  onSaved: () => void;
}) {
  const [firstname, setFirstname] = useState(
    application?.character_firstname ?? ""
  );
  const [lastname, setLastname] = useState(
    application?.character_lastname ?? ""
  );
  const [characterAge, setCharacterAge] = useState(
    application?.character_age?.toString() ?? ""
  );
  const [background, setBackground] = useState(
    application?.character_background ?? ""
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (locked) {
    return (
      <div className={`${styles.card} ${styles.cardNarrow}`}>
        <h2 className={styles.cardTitle}>Personnage</h2>
        <p className={styles.cardText}>
          Réussis d&apos;abord le questionnaire pour débloquer cet onglet.
        </p>
      </div>
    );
  }

  async function submit() {
    const ageNum = Number(characterAge);

    if (!firstname.trim() || !lastname.trim()) {
      setError("Renseigne le prénom et le nom de ton personnage.");
      return;
    }
    if (!characterAge || Number.isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
      setError("Renseigne un âge de personnage valide.");
      return;
    }
    if (background.trim().length < 20) {
      setError("Le background doit faire au moins 20 caractères.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/whitelist/character", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname,
        lastname,
        characterAge: ageNum,
        background,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError("Une erreur est survenue, réessaie.");
      return;
    }

    onSaved();
  }

  return (
    <div className={`${styles.card} ${styles.cardNarrow}`}>
      <h2 className={styles.cardTitle}>Personnage</h2>
      <p className={styles.cardText} style={{ marginBottom: 24 }}>
        Le concept de ton personnage. Il ne sera créé qu&apos;après acceptation.
      </p>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.rowThree}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="firstname">
            Prénom
          </label>
          <input
            id="firstname"
            className={styles.input}
            value={firstname}
            disabled={readOnly}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lastname">
            Nom
          </label>
          <input
            id="lastname"
            className={styles.input}
            value={lastname}
            disabled={readOnly}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="characterAge">
            Âge
          </label>
          <input
            id="characterAge"
            className={styles.input}
            type="number"
            min={0}
            max={120}
            value={characterAge}
            disabled={readOnly}
            onChange={(e) => setCharacterAge(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="background">
          Background du personnage
        </label>
        <textarea
          id="background"
          className={styles.textareaLarge}
          value={background}
          disabled={readOnly}
          onChange={(e) => setBackground(e.target.value)}
        />
      </div>

      {!readOnly && (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.button}
            disabled={submitting}
            onClick={submit}
          >
            {submitting ? "Envoi..." : "Envoyer ma candidature"}
          </button>
        </div>
      )}
    </div>
  );
}
