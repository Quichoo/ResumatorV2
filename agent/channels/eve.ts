import { eveChannel } from "eve/channels/eve";
import { httpBasic } from "eve/channels/auth";

const password = process.env.EVE_SERVER_SECRET;

if (!password || !/^[a-f0-9]{64}$/i.test(password)) {
  throw new Error(
    "EVE_SERVER_SECRET must contain a generated 64-character hexadecimal value.",
  );
}

export default eveChannel({
  auth: httpBasic({
    username: "resumator-server",
    password,
  }),
});
