import type { Metadata } from "next";
import { Suspense } from "react";
import ProfilContent from "./ProfilContent";
import panel from "../Panel.module.css";

export const metadata: Metadata = {
  title: "Profil - Epsilon Roleplay",
  description: "Ton profil Discord sur Epsilon Roleplay.",
};

export default function ProfilPage() {
  return (
    <div className={panel.pageContainer}>
      <div className={panel.pageHeader}>
        <span className={panel.pageBadge}>Compte</span>
        <h1 className={panel.pageTitle}>Profil</h1>
      </div>

      <Suspense fallback={null}>
        <ProfilContent />
      </Suspense>
    </div>
  );
}
