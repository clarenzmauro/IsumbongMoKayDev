import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
  }),

    problem_reactions: defineTable({
    problemId: v.id("problems"),
    userId: v.string(), // or use Auth user id if integrated
    type: v.union(v.literal("like"), v.literal("dislike")),
  }),
});
