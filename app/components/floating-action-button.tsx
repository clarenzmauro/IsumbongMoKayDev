"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import { ProblemForm } from "./problem-form"

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110"
      >
        <Plus size={28} />
      </button>

      {isOpen && (
        <ProblemForm onClose={() => setIsOpen(false)} />
      )}
    </>
  )
}
