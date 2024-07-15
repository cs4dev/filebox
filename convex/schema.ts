import { migrationsTable } from "convex-helpers/server/migrations";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

export const ALLOWED_MAX_FILE_SIZE = 10_000_000;

export const ALLOWED_CONTENT_TYPES = {
  "application/pdf": "pdf",
  "image/png": "png",
  "image/jpeg": "jpeg"
} as Record<string, Doc<"files">["type"]>

export const fileTypes = v.union(
  v.literal("pdf"),
  v.literal("jpeg"),
  v.literal("png")
)

export default defineSchema({
  migrations: migrationsTable,
  
  files: defineTable({ 
    name: v.string(),
    type: fileTypes,
    size: v.number(),
    orgId: v.string(),
    fileId: v.id("_storage"),
    hidden: v.boolean(),
  }).index("by_orgId", ['orgId']),


  users: defineTable({
    tokenIdentifier: v.string(),
    orgIds: v.array(v.string())
  }).index("by_tokenIdentifier", ['tokenIdentifier'])
});