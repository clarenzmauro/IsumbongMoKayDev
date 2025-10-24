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
    location: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const problem = {
      ...args,
      userName: identity?.name ?? "Anonymous",
      userAvatar: identity?.pictureUrl ?? "",
      datePosted: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      devsInterested: 0,
    };

    const id = await ctx.db.insert("problems", problem);
    return id;
  },
});