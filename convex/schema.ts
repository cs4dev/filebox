import { migrationsTable } from "convex-helpers/server/migrations";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  migrations: migrationsTable,
  files: defineTable({ name: v.string(), orgId: v.string() }).index("by_orgId", ['orgId']),
  users: defineTable({
    tokenIdentifier: v.string(),
    orgIds: v.array(v.string())
  }).index("by_tokenIdentifier", ['tokenIdentifier'])
});