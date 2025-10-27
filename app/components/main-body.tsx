"use client";

import { useMemo, useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { ProblemCard } from "./problem-card";

export function MainBody() {
  const placeholderImage = "/assets/logo/cropped.png";
  const backgroundImage = "/assets/images/bg.png";
  const problems = useQuery(api.functions.problems.getAllProblems);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'likes' | 'interested'>('newest');
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(searchQuery.trim().toLowerCase()), 200);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const filteredAndSorted = useMemo(() => {
    if (!problems) return [];
    const q = debouncedQuery;
    const filtered = q
      ? problems.filter(p => {
          const inTitle = p.title?.toLowerCase().includes(q);
          const inTags = p.tags?.some(t => t.toLowerCase().includes(q));
          return Boolean(inTitle || inTags);
        })
      : problems;

    const list = [...filtered];

    const compareNewest = (a: Doc<"problems">, b: Doc<"problems">) =>
      b.datePosted.localeCompare(a.datePosted);

    const compareOldest = (a: Doc<"problems">, b: Doc<"problems">) =>
      a.datePosted.localeCompare(b.datePosted);

    const compareLikes = (a: Doc<"problems">, b: Doc<"problems">) => {
      const diff = (b.likes ?? 0) - (a.likes ?? 0);
      return diff !== 0 ? diff : compareNewest(a, b);
    };

    const compareInterested = (a: Doc<"problems">, b: Doc<"problems">) => {
      const diff = (b.devsInterested ?? 0) - (a.devsInterested ?? 0);
      return diff !== 0 ? diff : compareNewest(a, b);
    };

    switch (sortBy) {
      case 'oldest':
        return list.sort(compareOldest);
      case 'likes':
        return list.sort(compareLikes);
      case 'interested':
        return list.sort(compareInterested);
      case 'newest':
      default:
        return list.sort(compareNewest);
    }
  }, [problems, sortBy, debouncedQuery]);

  if (problems === undefined) {
    return (
      <main className="w-full bg-gray-100 py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          Loading community problems...
        </div>
      </main>
    );
  }

  if (problems.length === 0) {
    return (
      <main className="w-full bg-gray-100 py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          No problems have been posted yet.
        </div>
      </main>
    );
  }

  return (
    <main
      className="relative w-full bg-gray-100 py-24 px-4 sm:px-6 md:px-12 overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "repeat",
        opacity: 0.95,
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-white/50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h3
            className="text-3xl font-bold text-gray-900 tracking-wide"
            style={{
              textShadow: "0 0 2px rgba(0, 0, 0, 0.15)", // subtle dark shadow
            }}
          >
            Community Reported Problems
          </h3>
          <p className="text-gray-800 mt-2 text-lg md:text-xl">
            Explore issues raised by citizens and developers aiming to solve them.
          </p>

          {/* Decorative color bar */}
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-yellow-400 to-red-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* to be updated to server-side filtering and sorting */}
        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title or tags…"
            className="w-full sm:w-80 px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Search problems by title or tags"
          />
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-gray-700 font-medium">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="likes">Most liked</option>
              <option value="interested">Most interested</option>
            </select>
          </div>
        </div>

        {/* Cards Grid or No Matches */}
        {filteredAndSorted.length === 0 ? (
          <div className="text-center text-black mt-8">
            No matches for "{searchQuery}".
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mt-8">
            {filteredAndSorted.map((problem) => (
              <ProblemCard
                key={problem._id}
                problemId={problem._id}
                {...problem}
                coverImage={problem.coverImage || placeholderImage}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
