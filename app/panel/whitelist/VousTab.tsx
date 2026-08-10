"use client";

import { useState } from "react";
import styles from "./Whitelist.module.css";
import type { Application } from "./WhitelistPanel";

export default function VousTab({
  application,
  readOnly,
  onSaved,
}: {
  application: Application | null;
  readOnly: boolean;
  onSaved: () => void;
}) {
  const [playtimeHours, setPlaytimeHours] = useState(
    application?.playtime_hours?.toString() ?? ""
  );
  const [age, setAge] = useState(application?.age?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  async function submit() {
    const hoursNum = Number(playtimeHours);
    const ageNum = Number(age);

    if (!playtimeHours || Number.isNaN(hoursNum) || hoursNum < 0) {
      setError("Renseigne un nombre d'heures valide.");
      return;
    }
    if (!age || Number.isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
      setError("Renseigne un âge valide (13 ans minimum).");
      return;
    }

    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/whitelist/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playtimeHours: hoursNum, age: ageNum }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError("Une erreur est survenue, réessaie.");
      return;
    }

    setSaved(true);
    onSaved();
  }

  return (
    <div className={`${styles.card} ${styles.cardNarrow}`}>
      <h2 className={styles.cardTitle}>Vous</h2>
      <p className={styles.cardText} style={{ marginBottom: 24 }}>
        Ces informations nous permettent de mieux te connaître avant de commencer.
      </p>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="playtime">
            Heures sur FiveM
          </label>
          <input
            id="playtime"
            className={styles.input}
            type="number"
            min={0}
            value={playtimeHours}
            disabled={readOnly}
            onChange={(e) => setPlaytimeHours(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="age">
            Ton âge
          </label>
          <input
            id="age"
            className={styles.input}
            type="number"
            min={13}
            max={120}
            value={age}
            disabled={readOnly}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
      </div>

      {!readOnly && (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.button}
            disabled={submitting}
            onClick={submit}
          >
            {submitting ? "Enregistrement..." : saved ? "Enregistré ✓" : "Enregistrer"}
          </button>
        </div>
      )}
    </div>
  );
}
