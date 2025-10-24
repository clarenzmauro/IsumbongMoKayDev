import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * 💬 Add a new discussion comment
 */
export const addDiscussion = mutation({
  args: {
    problemId: v.id("problems"),
    message: v.string(),
    parentId: v.optional(v.id("problem_discussions")),
  },
  handler: async (ctx, { problemId, message, parentId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User not authenticated");

    // Get the user record from your 'users' table
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found in database");

    const newComment = {
      problemId,
      userId: user._id,
      message,
      parentId,
      createdAt: new Date().toISOString(),
    };

    const id = await ctx.db.insert("problem_discussions", newComment);
    return id;
  },
});

/**
 * 🧵 Fetch all discussions for a given problem
 */
export const getDiscussionsByProblem = query({
  args: { problemId: v.id("problems") },
  handler: async (ctx, { problemId }) => {
    const comments = await ctx.db
      .query("problem_discussions")
      .withIndex("by_problem", (q) => q.eq("problemId", problemId))
      .filter((q) => q.eq(q.field("parentId"), undefined)) // ✅ only top-level
      .order("asc")
      .collect();

    // Attach user info
    const enriched = await Promise.all(
      comments.map(async (c) => {
        const user = await ctx.db.get(c.userId);
        return {
          ...c,
          userName:
            user?.username ||
            `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
            "Anonymous",
          userAvatar: user?.imageUrl ?? "",
        };
      })
    );

    return enriched;
  },
});


/**
 * 🔁 Fetch replies to a specific discussion comment
 */
export const getReplies = query({
  args: { parentId: v.id("problem_discussions") },
  handler: async (ctx, { parentId }) => {
    const replies = await ctx.db
      .query("problem_discussions")
      .withIndex("by_parent", (q) => q.eq("parentId", parentId))
      .order("asc")
      .collect();

    const enriched = await Promise.all(
      replies.map(async (r) => {
        const user = await ctx.db.get(r.userId);
        return {
          ...r,
          userName:
            user?.username ||
            `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
            "Anonymous",
          userAvatar: user?.imageUrl ?? "",
        };
      })
    );

    return enriched;
  },
});
