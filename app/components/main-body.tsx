"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProblemCard } from "./problem-card";

export function MainBody() {
  const placeholderImage = "/assets/logo/cropped.png";
  const backgroundImage = "/assets/images/bg.png";
  const problems = useQuery(api.functions.problems.getAllProblems);

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
      {/* Semi-transparent overlay to keep text readable */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 tracking-wide">
            Community Reported Problems
          </h3>
          <p className="text-gray-900 mt-2">
            Explore issues raised by citizens and developers aiming to solve them.
          </p>
          {/* Optional decorative divider */}
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-yellow-400 to-red-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {problems.map((problem, index) => (
            <ProblemCard
              key={index}
              problemId={problem._id}
              {...problem}
              coverImage={problem.coverImage || placeholderImage}
            />
          ))}
        </div>
      </div>
    </main>
  );
}