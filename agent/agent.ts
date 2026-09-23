import { defineAgent } from "eve";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export default defineAgent({
  model: openrouter("nvidia/nemotron-3-ultra-550b-a55b:free", {
    provider: {
      max_price: {
        prompt: 0,
        completion: 0,
      },
    },
    extraBody: {
      models: ["inclusionai/ling-3.0-flash-vl:free"],
      reasoning: {
        enabled: false,
      },
    },
  }),
  modelContextWindowTokens: 262_144,
  defaultTools: false,
  tool: false,
});
