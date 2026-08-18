import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  },

  typegen: {
    path: "./sanity/**/*.{ts,tsx}",
    schema: "./schema.json",
    generates: "./sanity.types.ts",
  },
});