"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import styles from "./Whitelist.module.css";
import type { Application } from "./WhitelistPanel";

export default function ProfilTab({
  application,
  readOnly,
  onSaved,
}: {
  application: Application | null;
  readOnly: boolean;
  onSaved: () => void;
}) {
  const { data: session } = useSession();
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
      setError("Renseigne un âge valide.");
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
      <h2 className={styles.cardTitle}>Profil Discord</h2>

      <div className={styles.discordAccount}>
        {session?.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "Avatar"}
            width={44}
            height={44}
            className={styles.discordAvatar}
          />
        )}
        <div>
          <div className={styles.discordName}>{session?.user?.name}</div>
          {session?.user?.email && (
            <div className={styles.discordEmail}>{session.user.email}</div>
          )}
        </div>
        <span
          className={`${styles.guildBadge} ${
            session?.user?.inGuild ? styles.guildBadgeIn : styles.guildBadgeOut
          }`}
        >
          <span className={styles.statusDot} />
          {session?.user?.inGuild ? "Sur le Discord" : "Pas sur le Discord"}
        </span>
      </div>

      <h3 className={styles.subTitle}>Informations joueur</h3>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="playtime">
            Heures FiveM
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
            Âge
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
