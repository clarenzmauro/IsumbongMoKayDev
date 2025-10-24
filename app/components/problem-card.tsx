"use client"
import Image from "next/image"
import { useState } from "react"
import { ThumbsUp, ThumbsDown, Share2, Code2, User } from "lucide-react"

interface ProblemCardProps {
  title: string
  description: string
  coverImage?: string
  userName?: string
  userAvatar?: string
  datePosted: string
  location: string
  tags: string[]
  likes?: number
  dislikes?: number
  devsInterested?: number
}

export function ProblemCard({
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
  const [likeCount, setLikeCount] = useState(likes)
  const [dislikeCount, setDislikeCount] = useState(dislikes)
  const [devCount, setDevCount] = useState(devsInterested)

  const handleLike = () => setLikeCount((prev) => prev + 1)
  const handleDislike = () => setDislikeCount((prev) => prev + 1)
  const handleDevInterest = () => setDevCount((prev) => prev + 1)

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("🔗 Link copied to clipboard!")
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-xl border border-gray-100">
      {/* Cover Image */}
      <div className="relative w-full h-56 bg-gray-100">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image Available
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>

        {/* Description */}
        <p className="text-gray-700 text-sm leading-relaxed">
          {description.length > 160
            ? description.slice(0, 160) + "..."
            : description}
        </p>

        {/* User Info, Date, Location */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {userAvatar ? (
              <Image
                src={userAvatar}
                alt={userName}
                width={28}
                height={28}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={16} className="text-gray-500" />
              </div>
            )}
            <span>{userName}</span>
          </div>
          <div className="text-right">
            <p>
              {new Date(datePosted).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-xs">{location}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Interaction Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
            >
              <ThumbsUp size={18} />
              <span>{likeCount}</span>
            </button>

            <button
              onClick={handleDislike}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
            >
              <ThumbsDown size={18} />
              <span>{dislikeCount}</span>
            </button>

            <button
              onClick={handleDevInterest}
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600"
            >
              <Code2 size={18} />
              <span>{devCount} Devs</span>
            </button>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center space-x-1 text-gray-600 hover:text-purple-600"
          >
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  )
}
