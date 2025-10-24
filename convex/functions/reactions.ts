import { mutation, MutationCtx } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

/**
 * ✅ Like / Dislike Mutation
 */
export const addOrUpdateReaction = mutation({
  args: {
    problemId: v.id("problems"),
    type: v.union(v.literal("like"), v.literal("dislike")),
  },
  handler: async (ctx, { problemId, type }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Find the user document using Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const userId = user._id;

    // Check if user already reacted
    const existingReaction = await ctx.db
      .query("problem_reactions")
      .withIndex("by_problem_user", (q) =>
        q.eq("problemId", problemId).eq("userId", userId)
      )
      .unique();

    if (existingReaction && existingReaction.type === type) {
      // Clicking same reaction again = remove it
      await ctx.db.delete(existingReaction._id);
    } else {
      // Otherwise, replace or insert
      if (existingReaction) await ctx.db.delete(existingReaction._id);
      await ctx.db.insert("problem_reactions", {
        problemId,
        userId,
        type,
      });
    }

    // ✅ Get updated counts
    const { likes, dislikes } = await updateReactionCounts(ctx, problemId);
    return { success: true, likes, dislikes };
  },
});

/**
 * ✅ Developer Interest Mutation
 */
export const toggleInterest = mutation({
  args: {
    problemId: v.id("problems"),
  },
  handler: async (ctx, { problemId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Find the user document in Convex
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const userId = user._id;

    // Check existing interest
    const existing = await ctx.db
      .query("problem_interests")
      .withIndex("by_problem_user", (q) =>
        q.eq("problemId", problemId).eq("userId", userId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    } else {
      await ctx.db.insert("problem_interests", {
        problemId,
        userId,
        createdAt: new Date().toISOString(),
      });
    }

    // ✅ Return new dev interest count
    const { devsInterested } = await updateInterestCount(ctx, problemId);
    return { success: true, devsInterested };
  },
});

/**
 * 🔁 Helper: Update like/dislike counts
 */
async function updateReactionCounts(ctx: MutationCtx, problemId: Id<"problems">) {
  const reactions = await ctx.db
    .query("problem_reactions")
    .withIndex("by_problem_user", (q) => q.eq("problemId", problemId))
    .collect();

  const likes = reactions.filter((r) => r.type === "like").length;
  const dislikes = reactions.filter((r) => r.type === "dislike").length;

  await ctx.db.patch(problemId, { likes, dislikes });
  return { likes, dislikes };
}

/**
 * 🔁 Helper: Update dev interest count
 */
async function updateInterestCount(ctx: MutationCtx, problemId: Id<"problems">) {
  const interests = await ctx.db
    .query("problem_interests")
    .withIndex("by_problem_user", (q) => q.eq("problemId", problemId))
    .collect();

  const devsInterested = interests.length;
  await ctx.db.patch(problemId, { devsInterested });
  return { devsInterested };
}
