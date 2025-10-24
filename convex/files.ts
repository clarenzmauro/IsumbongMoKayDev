import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Step 1: Generate an upload URL
 */
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

/**
 * Step 2: Store uploaded file metadata in the database
 */
export const storeFile = mutation({
  args: {
    storageId: v.id("_storage"),
    problemId: v.optional(v.id("problems")),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);

    const safeUrl = url ?? undefined;
    // You can either store the file in a separate "files" table
    // or update the "problems" record directly if linked
    if (args.problemId) {
      await ctx.db.patch(args.problemId, { coverImage: safeUrl });
    }

    return { url: safeUrl };
  },
});
