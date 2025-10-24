"use client";

import Image from "next/image";
import { useState, Dispatch, SetStateAction } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { User, Calendar, MapPin, Tag, MessageCircle, Users, CornerDownRight } from "lucide-react";

type Discussion = {
  _id: Id<"problem_discussions">;
  userId: Id<"users">;
  userName: string;
  userAvatar: string;
  problemId: Id<"problems">;
  parentId?: Id<"problem_discussions">;
  message: string;
  createdAt: string;
  _creationTime: number;
};


interface CommentThreadProps {
  discussion: Discussion;
  replyingTo: string | null;
  setReplyingTo: Dispatch<SetStateAction<string | null>>;
  replyText: string;
  setReplyText: Dispatch<SetStateAction<string>>;
  handlePostReply: (parentId: Id<"problem_discussions">) => Promise<void>;
}

export default function DeveloperCornerClient({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState<"discussion" | "developers">("discussion");
  const [comment, setComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // ✅ Fetch problem
  const problem = useQuery(api.functions.problems.getProblemById, { id: id as Id<"problems"> });

  // ✅ Fetch discussions (top-level)
  const discussions = useQuery(api.functions.discussions.getDiscussionsByProblem, {
    problemId: id as Id<"problems">,
  });

  // ✅ Mutation for adding a comment/reply
  const addDiscussion = useMutation(api.functions.discussions.addDiscussion);

  const interestedDevelopers = useQuery(api.functions.discussions.getInterestedDevelopers, {
  problemId: id as Id<"problems">,
});

  // ✅ Function to fetch replies per comment
  const useReplies = (parentId: Id<"problem_discussions">) =>
    useQuery(api.functions.discussions.getReplies, { parentId });

  // 📝 Handlers
  const handlePostComment = async () => {
    if (!comment.trim()) return;
    await addDiscussion({
      problemId: id as Id<"problems">,
      message: comment.trim(),
    });
    setComment("");
  };

  const handlePostReply = async (parentId: Id<"problem_discussions">) => {
    if (!replyText.trim()) return;
    await addDiscussion({
      problemId: id as Id<"problems">,
      message: replyText.trim(),
      parentId,
    });
    setReplyText("");
    setReplyingTo(null);
  };

  // Loading states
  if (problem === undefined)
    return <div className="p-10 text-gray-500 text-center">Loading problem...</div>;
  if (problem === null)
    return <div className="p-10 text-red-500 text-center">Problem not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10 lg:px-20">
      {/* Problem Header */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 max-w-5xl mx-auto">
        {problem.coverImage && (
          <div className="relative w-full h-72 bg-gray-100">
            <Image
              src={problem.coverImage}
              alt={problem.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        <div className="p-6 md:p-8 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{problem.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              <span>{problem.userName ?? "Anonymous"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span>
                {new Date(problem.datePosted).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-400" />
              <span>{problem.location}</span>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{problem.description}</p>

          <div className="flex flex-wrap gap-2 pt-3">
            {problem.tags.map((tag: string, i: number) => (
              <span
                key={i}
                className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto mt-8">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${
              activeTab === "discussion"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("discussion")}
          >
            <MessageCircle size={16} />
            Discussion
          </button>
          <button
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${
              activeTab === "developers"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("developers")}
          >
            <Users size={16} />
            Interested Developers
          </button>
        </div>

        {/* --- DISCUSSION --- */}
        {activeTab === "discussion" && (
          <div className="bg-white rounded-b-2xl shadow-md p-6 border border-t-0 border-gray-100 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Discussion</h2>

            {discussions === undefined ? (
              <p className="text-gray-500">Loading discussions...</p>
            ) : discussions.length === 0 ? (
              <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
            ) : (
              <div className="space-y-6">
                {discussions.map((d) => (
                    <CommentThread
                        key={d._id}
                        discussion={d}
                        replyingTo={replyingTo}
                        setReplyingTo={setReplyingTo}
                        replyText={replyText}
                        setReplyText={setReplyText}
                        handlePostReply={handlePostReply}
                    />
                ))}
              </div>
            )}

            {/* 📝 Main Comment Box */}
            <div className="mt-6">
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Write a comment..."
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                onClick={handlePostComment}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Post Comment
              </button>
            </div>
          </div>
        )}

        {/* --- INTERESTED DEVELOPERS (dummy for now) --- */}
        {activeTab === "developers" && (
  <div className="bg-white rounded-b-2xl shadow-md p-6 border border-t-0 border-gray-100 space-y-6">
    <h2 className="text-lg font-semibold text-gray-900">Interested Developers</h2>

    {interestedDevelopers === undefined ? (
      <p className="text-gray-500 text-sm">Loading developers...</p>
    ) : interestedDevelopers.length === 0 ? (
      <p className="text-gray-500 text-sm">No developers have shown interest yet.</p>
    ) : (
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {interestedDevelopers.map((dev) => (
          <li
            key={dev._id}
            className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 hover:shadow-sm transition"
          >
            <Image
              src={dev.userAvatar || "https://i.pravatar.cc/40"}
              alt={dev.userName}
              width={40}
              height={40}
              className="rounded-full"
              unoptimized
            />
            <div>
              <p className="font-medium text-gray-800">{dev.userName}</p>
              <p className="text-xs text-gray-500">
                Joined: {new Date(dev.createdAt).toLocaleDateString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
)}

      </div>
    </div>
  );
}

// 🧩 Subcomponent for threaded comments
function CommentThread({
  discussion,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
  handlePostReply,
}: CommentThreadProps) {
  // ✅ Fetch replies for this specific comment
  const replies = useQuery(api.functions.discussions.getReplies, {
    parentId: discussion._id,
  });

  return (
    <div>
      <div className="flex gap-3">
        <Image
          src={discussion.userAvatar || "https://i.pravatar.cc/40"}
          alt={discussion.userName}
          width={40}
          height={40}
          className="rounded-full"
          unoptimized
        />
        <div>
          <p className="font-medium text-gray-800">{discussion.userName}</p>
          <p className="text-gray-600 text-sm">{discussion.message}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
            <span>{new Date(discussion.createdAt).toLocaleString()}</span>
            <button
              onClick={() =>
                setReplyingTo(replyingTo === discussion._id ? null : discussion._id)
              }
              className="text-blue-600 hover:underline"
            >
              Reply
            </button>
          </div>

          {/* 📝 Reply box */}
          {replyingTo === discussion._id && (
            <div className="mt-3 ml-4">
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                rows={2}
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button
                onClick={() => handlePostReply(discussion._id)}
                className="mt-1 px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
              >
                Reply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔁 Nested Replies */}
      {replies === undefined ? (
        <div className="ml-10 text-gray-400 text-xs mt-2">Loading replies...</div>
      ) : replies.length > 0 ? (
        <div className="ml-10 mt-3 space-y-3 border-l border-gray-200 pl-4">
          {replies.map((r) => (
            <div key={r._id} className="flex gap-3">
              <CornerDownRight size={14} className="text-gray-400 mt-2" />
              <Image
                src={r.userAvatar || "https://i.pravatar.cc/40"}
                alt={r.userName}
                width={35}
                height={35}
                className="rounded-full"
                unoptimized
              />
              <div>
                <p className="font-medium text-gray-800 text-sm">{r.userName}</p>
                <p className="text-gray-600 text-sm">{r.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
