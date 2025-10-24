"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { User, Calendar, MapPin, Tag, MessageCircle, Users } from "lucide-react";

export default function DeveloperCornerClient({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState<"discussion" | "developers">("discussion");

  // ✅ Fetch from Convex
  const problem = useQuery(api.functions.problems.getProblemById, { id: id as Id<"problems"> });

  // Loading state
  if (problem === undefined)
    return <div className="p-10 text-gray-500 text-center">Loading problem...</div>;

  // Not found state
  if (problem === null)
    return <div className="p-10 text-red-500 text-center">Problem not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10 lg:px-20">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 max-w-5xl mx-auto">
        {/* Cover Image */}
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

        {/* Problem Content */}
        <div className="p-6 md:p-8 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{problem.title}</h1>

          {/* Meta Info */}
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

          {/* Description */}
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {problem.description}
          </p>

          {/* Tags */}
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

      {/* Tabs Section */}
      <div className="max-w-5xl mx-auto mt-8">
        {/* Tab buttons */}
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

        {/* Tab content */}
        <div className="bg-white rounded-b-2xl shadow-md p-6 border border-t-0 border-gray-100">
          {activeTab === "discussion" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Discussion</h2>

              {/* 🗨️ Dummy comments */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Image
                    src="https://randomuser.me/api/portraits/men/41.jpg"
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full"
                    unoptimized
                  />
                  <div>
                    <p className="font-medium text-gray-800">John Dev</p>
                    <p className="text-gray-600 text-sm">
                      This project sounds exciting! Would you like to collaborate on the AI model
                      part?
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Image
                    src="https://randomuser.me/api/portraits/women/45.jpg"
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Ava Designer</p>
                    <p className="text-gray-600 text-sm">
                      I can help with the UI of the mobile app! Let me know how we can coordinate.
                    </p>
                  </div>
                </div>
              </div>

              {/* 📝 Comment input (dummy) */}
              <div className="mt-6">
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Write a comment..."
                  rows={3}
                />
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  Post Comment
                </button>
              </div>
            </div>
          )}

          {activeTab === "developers" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Interested Developers</h2>

              {/* 👥 Dummy developers */}
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    name: "Ravi Engineer",
                    skills: ["AI", "Python"],
                    avatar: "https://randomuser.me/api/portraits/men/51.jpg",
                  },
                  {
                    name: "Ella Coder",
                    skills: ["React", "Firebase"],
                    avatar: "https://randomuser.me/api/portraits/women/29.jpg",
                  },
                  {
                    name: "Liam Tech",
                    skills: ["Node.js", "TensorFlow"],
                    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
                  },
                ].map((dev, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100 hover:bg-gray-100 transition"
                  >
                    <Image
                      src={dev.avatar}
                      alt={dev.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{dev.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dev.skills.map((skill, s) => (
                          <span
                            key={s}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
