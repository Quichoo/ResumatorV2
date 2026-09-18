import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";

import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";

export const auth = betterAuth({
  ...authOptions,

  database: drizzleAdapter(db, {
    provider: "pg",
    transaction: false,
  }),

  plugins: [nextCookies()],
});
