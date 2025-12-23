import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql", // or "mysql" or "sqlite"
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
