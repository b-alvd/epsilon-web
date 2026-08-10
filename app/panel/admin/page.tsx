import { Suspense } from "react";
import panel from "../Panel.module.css";
import AdminContent from "./AdminContent";

export default function AdminPage() {
  return (
    <div className={panel.pageContainer}>
      <div className={panel.pageHeader}>
        <span className={panel.pageBadge}>Administration</span>
        <h1 className={panel.pageTitle}>Candidatures whitelist</h1>
      </div>
      <Suspense fallback={null}>
        <AdminContent />
      </Suspense>
    </div>
  );
}
