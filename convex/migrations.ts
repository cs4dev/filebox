import { makeMigration } from "convex-helpers/server/migrations";
import { internalMutation } from "./_generated/server";

const migration = makeMigration(internalMutation, {
  migrationTable: "migrations",
});

export const patchEmptyOrgId = migration({
    table: "files",
    migrateOne: async (ctx, files) => {
      if (!files.orgId) {
        await ctx.db.patch(files._id, {
          orgId: 'org_2j3bovhf5NtCZ992gszZXRGET7w'
        });
      }
    },
});


export const patchDefaultHiddenValue = migration({
  table: "files",
  migrateOne: async (ctx, files) => {
    if (files.hidden === undefined) {
      await ctx.db.patch(files._id, {
        hidden: false
      });
    }
  },
});

