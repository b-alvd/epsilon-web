import { Suspense } from "react";
import panel from "../../Panel.module.css";
import StreamersAdminContent from "./StreamersAdminContent";

export default function StreamersAdminPage() {
  return (
    <div className={panel.pageContainer}>
      <div className={panel.pageHeader}>
        <span className={panel.pageBadge}>Administration</span>
        <h1 className={panel.pageTitle}>Candidatures streamers</h1>
      </div>
      <Suspense fallback={null}>
        <StreamersAdminContent />
      </Suspense>
    </div>
  );
}
