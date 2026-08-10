import { Suspense } from "react";
import Link from "next/link";
import panel from "../../../Panel.module.css";
import PlayerDetail from "./PlayerDetail";

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ discordId: string }>;
}) {
  const { discordId } = await params;

  return (
    <div className={panel.pageContainer}>
      <div className={panel.pageHeader}>
        <span className={panel.pageBadge}>
          <Link href="/panel/admin/joueurs" style={{ color: "inherit", opacity: 0.7 }}>
            Joueurs
          </Link>
          {" / "}
          Fiche joueur
        </span>
        <h1 className={panel.pageTitle}>Détail du joueur</h1>
      </div>
      <Suspense fallback={null}>
        <PlayerDetail discordId={discordId} />
      </Suspense>
    </div>
  );
}
