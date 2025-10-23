"use client"
import { ProblemCard } from "./problem-card"

export function MainBody() {
  const placeholderImage = "/assets/logo/cropped.png"

  // 🧩 Temporary sample data
  const problems = [
    {
      title: "Flooding in Barangay San Jose",
      description:
        "During the monsoon season, streets in Barangay San Jose are often submerged due to poor drainage systems. We need a sustainable and tech-based solution to mitigate flooding and improve safety.",
      coverImage: "",
      userName: "John Doe",
      datePosted: "Oct 23, 2025",
      location: "Batangas City",
      tags: ["Environment", "Community", "Infrastructure"],
      likes: 24,
      dislikes: 3,
      devsInterested: 7,
    },
    {
      title: "Waste Segregation Awareness",
      description:
        "Many residents in our barangay still mix biodegradable and non-biodegradable waste. We need a system to raise awareness and track proper waste disposal.",
      coverImage: "", // no image → will use placeholder
      userName: "Anonymous",
      datePosted: "Oct 21, 2025",
      location: "Quezon City",
      tags: ["Environment", "Awareness", "Education"],
      likes: 10,
      dislikes: 1,
      devsInterested: 4,
    },
    {
      title: "Traffic Congestion Near School Zone",
      description:
        "Heavy traffic occurs every morning near the local high school. Parents and students are often late. A traffic flow solution would be valuable.",
      coverImage: "",
      userName: "Maria Clara",
      datePosted: "Oct 19, 2025",
      location: "Manila",
      tags: ["Transportation", "Community", "Safety"],
      likes: 18,
      dislikes: 2,
      devsInterested: 5,
    },
  ]

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
              {...problem}
              coverImage={problem.coverImage || placeholderImage}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
