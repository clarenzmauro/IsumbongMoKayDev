import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  // USERS
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    username: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    provider: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  // PROBLEMS
  problems: defineTable({
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
  }).index("by_date", ["datePosted"]),

  // REACTIONS (likes/dislikes)
  problem_reactions: defineTable({
    problemId: v.id("problems"),
    userId: v.id("users"),
    type: v.union(v.literal("like"), v.literal("dislike")),
  })
    .index("by_problem_user", ["problemId", "userId"]),

  // DEV INTERESTS (new)
  problem_interests: defineTable({
    problemId: v.id("problems"),
    userId: v.id("users"),
    createdAt: v.string(),
  })
    .index("by_problem_user", ["problemId", "userId"]),
});
