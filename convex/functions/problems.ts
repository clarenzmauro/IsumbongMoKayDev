import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

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
 * Add a new problem post (allows anonymous users)
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

    // Use `undefined` instead of `null`
    let userId: Id<"users"> | undefined = undefined;
    let userName = "Anonymous";
    let userAvatar = "";

    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
        .unique();

      if (user) {
        userId = user._id;
        userName = identity.name ?? "Anonymous";
        userAvatar = identity.pictureUrl ?? "";
      }
    }

    // ✅ Explicitly build the object with only defined keys
    const problem: {
      coverImage?: string;
      userId?: Id<"users">;
      userName: string;
      userAvatar: string;
      title: string;
      description: string;
      location: string;
      tags: string[];
      datePosted: string;
      likes: number;
      dislikes: number;
      devsInterested: number;
    } = {
      ...args,
      ...(userId ? { userId } : {}), // only add userId if defined
      userName,
      userAvatar,
      datePosted: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      devsInterested: 0,
    };

    const id = await ctx.db.insert("problems", problem);
    return id;
  },
});


/**
 * Fetch a single problem by ID
 */
export const getProblemById = query({
  args: { id: v.id("problems") },
  handler: async (ctx, args) => {
    const problem = await ctx.db.get(args.id);
    if (!problem) throw new Error("Problem not found");
    return problem;
  },
});
