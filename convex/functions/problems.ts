import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Fetch all problems
 */
export const getAllProblems = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("problems").order("desc").collect();
  },
});

/**
 * Add a new problem post
 */
export const addProblem = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    coverImage: v.optional(v.string()),
    userName: v.optional(v.string()),
    userAvatar: v.optional(v.string()),
    datePosted: v.string(),
    location: v.string(),
    tags: v.array(v.string()),
    likes: v.optional(v.number()),
    dislikes: v.optional(v.number()),
    devsInterested: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("problems", args);
  },
});