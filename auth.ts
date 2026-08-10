import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { getDb } from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Discord({
      authorization: {
        params: { scope: "identify email guilds" },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, profile }) {
      if (!profile?.id) return false;

      await getDb().query(
        `INSERT INTO web_users (discord_id, username, avatar, email)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           username = VALUES(username),
           avatar = VALUES(avatar),
           email = VALUES(email)`,
        [
          profile.id,
          user.name ?? "Inconnu",
          user.image ?? null,
          user.email ?? null,
        ]
      );

      return true;
    },
    async jwt({ token, profile, account }) {
      if (profile?.id) {
        token.discordId = profile.id;
      }

      // Recalculé à chaque refresh pour prendre en compte les changements d'env
      if (token.discordId) {
        const adminIds = (process.env.ADMIN_DISCORD_IDS ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        token.isAdmin = adminIds.includes(token.discordId as string);
      }

      if (account?.access_token && process.env.DISCORD_GUILD_ID) {
        try {
          const res = await fetch(
            "https://discord.com/api/users/@me/guilds",
            {
              headers: { Authorization: `Bearer ${account.access_token}` },
            }
          );
          if (res.ok) {
            const guilds: { id: string }[] = await res.json();
            token.inGuild = guilds.some(
              (g) => g.id === process.env.DISCORD_GUILD_ID
            );
          }
        } catch {
          // Si l'appel échoue, on ne modifie pas token.inGuild
          // (garde la dernière valeur connue plutôt que de bloquer à tort).
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.discordId) {
        session.user.discordId = token.discordId as string;
      }
      session.user.inGuild = (token.inGuild as boolean | undefined) ?? false;
      session.user.isAdmin = (token.isAdmin as boolean | undefined) ?? false;
      return session;
    },
  },
});
