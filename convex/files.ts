import { ConvexError, v } from 'convex/values'
import { mutation, MutationCtx, query, QueryCtx } from './_generated/server'
import { getUser } from './users'
import { fileTypes } from './schema'
import { Doc, Id } from './_generated/dataModel'

export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
        throw new ConvexError("Authenication Error: Sign In")
    }
    return await ctx.storage.generateUploadUrl()
})

async function hasAccessToOrg(
    ctx: QueryCtx | MutationCtx,
    tokenIdentifier: string,
    orgId: string
) {
    const user = await getUser(ctx, tokenIdentifier)
    return user?.orgIds.includes(orgId) || user?.tokenIdentifier.includes(orgId)
}

export const createFile = mutation({
    args: {
        name: v.string(),
        orgId: v.string(),
        fileId: v.id("_storage"),
        type: fileTypes,
        size: v.number()
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new ConvexError("Authenication Error: Sign In")
        }
        const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId)
        if (!hasAccess) {
            throw new ConvexError("Forbidden Error: No Access to Org")
        }
        await ctx.db.insert('files', {
            name: args.name,
            orgId: args.orgId,
            fileId: args.fileId,
            type: args.type,
            size: args.size,
            hidden: false
        })
    },
})

export const getFiles = query({
    args: { 
        orgId: v.string()
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            return []
        }
        const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId)
        if (!hasAccess) {
            return []
        }
        return ctx.db
            .query('files')
            .withIndex('by_orgId', q => q.eq('orgId', args.orgId))
            .collect()
    }
})

export const getFileUrl = query({
    args: { 
        fileId: v.id("_storage"),
    },
    async handler(ctx, args) {
        return await ctx.storage.getUrl(args.fileId)
    },
})

export const deleteFile = mutation({
    args: { fileId: v.id("files") },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new ConvexError("Forbidden Error: No Access to Org")
        }
        const file = await ctx.db.get(args.fileId)
        if (!file) {
            throw new ConvexError("File Not Found")
        }

        const hasAccess = await hasAccessToOrg(
            ctx,
            identity.tokenIdentifier,
            file.orgId,
        )
        if (!hasAccess) {
            throw new ConvexError("Forbidden Error: No Access to delete file")
        }

        await Promise.all([
            ctx.db.delete(args.fileId),
            ctx.storage.delete(file.fileId)
        ])
    },
})

export const deleteFiles = mutation({
    args: { files: v.any() },
    async handler(ctx, args) {
        const toDeleteFiles = args.files as Doc<"files">[]
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new ConvexError("Forbidden Error: No Access to Org")
        }

        const hasAccess = await hasAccessToOrg(
            ctx,
            identity.tokenIdentifier,
            toDeleteFiles[0].orgId
        )

        if (!hasAccess) {
            throw new ConvexError("Forbidden Error: No Access to delete files")
        }

       await Promise.all([
        toDeleteFiles.map(async (file) => {
            ctx.db.delete(file._id),
            ctx.storage.delete(file.fileId)
        })
       ])
    },
})

export const hideFile = mutation({
    args: { fileId: v.id("files") },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new ConvexError("Forbidden Error: No Access to Org")
        }
        const file = await ctx.db.get(args.fileId)
        if (!file) {
            throw new ConvexError("File Not Found")
        }

        const hasAccess = await hasAccessToOrg(
            ctx,
            identity.tokenIdentifier,
            file.orgId,
        )
        if (!hasAccess) {
            throw new ConvexError("Forbidden Error: No Access to delete file")
        }
        
        await ctx.db.patch(args.fileId, { hidden: true })
    }
})

export const unHideFile = mutation({
    args: { fileId: v.id("files") },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new ConvexError("Forbidden Error: No Access to Org")
        }
        const file = await ctx.db.get(args.fileId)
        if (!file) {
            throw new ConvexError("File Not Found")
        }

        const hasAccess = await hasAccessToOrg(
            ctx,
            identity.tokenIdentifier,
            file.orgId,
        )
        if (!hasAccess) {
            throw new ConvexError("Forbidden Error: No Access to delete file")
        }
        
        await ctx.db.patch(args.fileId, { hidden: false })
    }
})
