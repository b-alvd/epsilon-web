import { Suspense } from "react";
import Sidebar from "./Sidebar";
import styles from "./layout.module.css";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
