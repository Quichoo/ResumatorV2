import type { MantineThemeOverride } from "@mantine/core";

const fontFamily = "var(--font-work-sans), Arial, sans-serif";

export const theme = {
  fontFamily,
  headings: {
    fontFamily,
  },
} satisfies MantineThemeOverride;
