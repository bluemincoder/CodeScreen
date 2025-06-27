import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAllInterviews = query({
  handler: async (ctx) => {
    // Simple auth check - always pass for now
    // TODO: Implement proper NextAuth integration
    const interviews = await ctx.db.query("interviews").collect();
    return interviews;
  },
});

export const getMyInterviews = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    // Simple auth check - always pass for now
    // TODO: Implement proper NextAuth integration
    const interviews = await ctx.db
      .query("interviews")
      .withIndex("by_candidate_id", (q) => q.eq("candidateId", args.userEmail))
      .collect();

    return interviews;
  },
});

export const getInterviewByStreamCallId = query({
  args: { streamCallId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("interviews")
      .withIndex("by_stream_call_id", (q) =>
        q.eq("streamCallId", args.streamCallId)
      )
      .first();
  },
});

export const createInterview = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Simple auth check - always pass for now
    // TODO: Implement proper NextAuth integration
    return await ctx.db.insert("interviews", {
      ...args,
    });
  },
});

export const updateInterviewStatus = mutation({
  args: {
    id: v.id("interviews"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
      ...(args.status === "completed" ? { endTime: Date.now() } : {}),
    });
  },
});
