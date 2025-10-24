"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ProblemCard } from "./problem-card"

export function MainBody() {
  const placeholderImage = "/assets/logo/cropped.png"

  const problems = useQuery(api.functions.problems.getAllProblems)

  if (problems === undefined) {
    return (
      <main className="w-full bg-gray-100 py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          Loading community problems...
        </div>
      </main>
    )
  }

  if (problems.length === 0) {
    return (
      <main className="w-full bg-gray-100 py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          No problems have been posted yet.
        </div>
      </main>
    )
  }

  return (
    <main className="w-full bg-gray-100 py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 tracking-wide">
            Community Reported Problems
          </h3>
          <p className="text-gray-600 mt-2">
            Explore issues raised by citizens and developers aiming to solve them.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
  )
}
  