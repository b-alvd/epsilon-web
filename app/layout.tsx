import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Epsilon Roleplay",
  description: "Serveur FiveM Epsilon Roleplay",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
