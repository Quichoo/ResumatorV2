import "server-only";

import { Client } from "eve/client";

export function createEveClient() {
  const host = process.env.EVE_AGENT_URL;
  const password = process.env.EVE_SERVER_SECRET;

  if (!host || !password || !/^[a-f0-9]{64}$/i.test(password)) {
    throw new Error("Missing or invalid Eve service configuration.");
  }

  const url = new URL(host);

  const isLoopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);

  const isLocalHttp = url.protocol === "http:" && isLoopback;

  if (url.protocol !== "https:" && !isLocalHttp) {
    throw new Error("Eve requires HTTPS outside localhost.");
  }

  if (url.username || url.password) {
    throw new Error("EVE_AGENT_URL must not contain credentials.");
  }

  return new Client({
    host: url.toString(),
    auth: {
      basic: {
        username: "resumator-server",
        password,
      },
    },
    redirect: "error",
  });
}
