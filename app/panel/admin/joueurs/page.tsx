import { Suspense } from "react";
import panel from "../../Panel.module.css";
import PlayersContent from "./PlayersContent";

export default function JoueursAdminPage() {
  return (
    <div className={panel.pageContainer}>
      <div className={panel.pageHeader}>
        <span className={panel.pageBadge}>Administration</span>
        <h1 className={panel.pageTitle}>Joueurs</h1>
      </div>
      <Suspense fallback={null}>
        <PlayersContent />
      </Suspense>
    </div>
  );
}
