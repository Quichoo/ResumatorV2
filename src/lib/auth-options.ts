import type { BetterAuthOptions } from "better-auth";

export const authOptions = {
  appName: "Resumator",

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
  },
} satisfies BetterAuthOptions;
