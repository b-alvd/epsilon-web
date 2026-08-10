import type { Metadata } from "next";
import { Suspense } from "react";
import WhitelistPanel from "./WhitelistPanel";
import panel from "../Panel.module.css";

export const metadata: Metadata = {
  title: "Whitelist - Epsilon Roleplay",
  description: "Candidature whitelist Epsilon Roleplay.",
};

export default function WhitelistPage() {
  return (
    <div className={panel.pageContainer}>
      <div className={panel.pageHeader}>
        <span className={panel.pageBadge}>Whitelist</span>
        <h1 className={panel.pageTitle}>Candidature</h1>
      </div>

      <Suspense fallback={null}>
        <WhitelistPanel />
      </Suspense>
    </div>
  );
}
