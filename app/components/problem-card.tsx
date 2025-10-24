"use client";
import Image from "next/image";
import { useState } from "react";
import { ThumbsUp, ThumbsDown, Share2, Code2, User } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Id } from "../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";

interface ProblemCardProps {
  problemId: Id<"problems">;
  title: string;
  description: string;
  coverImage?: string;
  userName?: string;
  userAvatar?: string;
  datePosted: string;
  location: string;
  tags: string[];
  likes?: number;
  dislikes?: number;
  devsInterested?: number;
}

export function ProblemCard({
  problemId,
  title,
  description,
  coverImage,
  userName = "Anonymous",
  userAvatar,
  datePosted,
  location,
  tags,
  likes = 0,
  dislikes = 0,
  devsInterested = 0,
}: ProblemCardProps) {
  const { user } = useUser();
  const router = useRouter();

  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);
  const [devCount, setDevCount] = useState(devsInterested);
  const [loading, setLoading] = useState(false);

  const addOrUpdateReaction = useMutation(api.functions.reactions.addOrUpdateReaction);
  const toggleInterest = useMutation(api.functions.reactions.toggleInterest);

  const handleReaction = async (type: "like" | "dislike") => {
    if (!user) return alert("Please sign in to react.");
    if (loading) return;
    setLoading(true);
    try {
      const result = await addOrUpdateReaction({ problemId, type });
      if (result?.success) {
        setLikeCount(result.likes ?? likeCount);
        setDislikeCount(result.dislikes ?? dislikeCount);
      }
    } catch (err) {
      console.error("Reaction error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDevInterest = async () => {
    if (!user) return alert("Please sign in to mark interest.");
    if (loading) return;
    setLoading(true);
    try {
      const result = await toggleInterest({ problemId });
      if (result?.success) {
        setDevCount(result.devsInterested ?? devCount);
      }
    } catch (err) {
      console.error("Interest toggle error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("🔗 Link copied to clipboard!");
  };

  // ✅ navigate to /developer-corner/[id]
  const handleCardClick = () => {
    router.push(`/developer-corner/${problemId}`);
  };

  return (
<div
  onClick={handleCardClick}
  className="bg-white rounded-2xl shadow-md overflow-hidden w-full border border-gray-100 cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
>
  {/* Cover Image */}
  <div className="relative w-full h-40 sm:h-44 md:h-56 bg-gray-100">
    {coverImage ? (
      <Image src={coverImage} alt={title} fill className="object-cover" unoptimized />
    ) : (
      <div className="flex items-center justify-center h-full text-gray-400">
        No Image Available
      </div>
    )}
  </div>

  {/* Content */}
  <div className="p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4">
    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 line-clamp-2">
      {title}
    </h2>
    <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-3">
      {description.length > 160 ? description.slice(0, 160) + "..." : description}
    </p>

    {/* User Info */}
    <div className="flex items-center justify-between text-[11px] sm:text-sm text-gray-500 pt-2 border-t border-gray-100">
      <div className="flex items-center space-x-2">
        {userAvatar ? (
          <Image
            src={userAvatar}
            alt={userName}
            width={24}
            height={24}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={14} className="text-gray-500" />
          </div>
        )}
        <span className="truncate max-w-[80px] sm:max-w-none">{userName}</span>
      </div>
      <div className="text-right hidden sm:block">
        <p>
          {new Date(datePosted).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
        <p className="text-xs">{location}</p>
      </div>
    </div>

    {/* Tags */}
    <div className="flex flex-wrap gap-1 sm:gap-2 pt-1 sm:pt-2">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
        >
          #{tag}
        </span>
      ))}
    </div>

    {/* Interaction Buttons */}
    <div
      className="flex items-center justify-between pt-3 border-t border-gray-100"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button
          onClick={() => handleReaction("like")}
          className={`flex items-center space-x-1 ${
            loading ? "opacity-50 cursor-not-allowed" : "text-gray-600 hover:text-blue-600"
          }`}
          disabled={loading}
        >
          <ThumbsUp size={16} />
          <span className="text-xs sm:text-sm">{likeCount}</span>
        </button>

        <button
          onClick={() => handleReaction("dislike")}
          className={`flex items-center space-x-1 ${
            loading ? "opacity-50 cursor-not-allowed" : "text-gray-600 hover:text-red-600"
          }`}
          disabled={loading}
        >
          <ThumbsDown size={16} />
          <span className="text-xs sm:text-sm">{dislikeCount}</span>
        </button>

        <button
          onClick={handleDevInterest}
          className={`flex items-center space-x-1 ${
            loading ? "opacity-50 cursor-not-allowed" : "text-gray-600 hover:text-green-600"
          }`}
          disabled={loading}
        >
          <Code2 size={16} />
          <span className="text-xs sm:text-sm">{devCount}</span>
        </button>
      </div>

      <button
        onClick={handleShare}
        className="flex items-center space-x-1 text-gray-600 hover:text-purple-600"
      >
        <Share2 size={16} />
        <span className="hidden sm:inline text-xs sm:text-sm">Share</span>
      </button>
    </div>
  </div>
</div>
  );
}
