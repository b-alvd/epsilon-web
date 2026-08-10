import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      discordId?: string;
      inGuild?: boolean;
      isAdmin?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    discordId?: string;
    inGuild?: boolean;
    isAdmin?: boolean;
  }
}
