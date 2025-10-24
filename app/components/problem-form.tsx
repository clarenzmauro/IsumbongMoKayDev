"use client"

import { useState } from "react"
import Image from "next/image"
import { X, UploadCloud, Hash } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export function ProblemForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [tagsInput, setTagsInput] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addProblem = useMutation(api.functions.problems.addProblem)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  // Convert tags like "#Education #Community" → ["Education", "Community"]
  const parseTags = (text: string) =>
    text
      .split("#")
      .map(t => t.trim())
      .filter(Boolean)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)

  try {
    let coverImageUrl: string | undefined = undefined

    // Step 1: Upload image to Convex Storage
    if (coverImage) {
      const uploadUrl = await generateUploadUrl();

      // Upload the image file via fetch
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": coverImage.type },
        body: coverImage,
      });

      const { storageId } = await result.json();

      // Get a public URL for preview/use
      const imageUrl = `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${storageId}`;
      coverImageUrl = imageUrl;
    }

    // Step 2: Prepare tags and send to Convex
    const tags = parseTags(tagsInput)
    
    await addProblem({
      title,
      description,
      location,
      coverImage: coverImageUrl,
      tags,
    })

    console.log("✅ Problem submitted successfully.")
    onClose()
  } catch (error) {
    console.error("❌ Error submitting problem:", error)
    alert("Failed to submit problem. Please try again.")
  } finally {
    setIsSubmitting(false)
  }
}


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-semibold mb-5 text-gray-800 text-center">
          🧩 Post a Problem
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter a descriptive title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Describe your problem clearly"
              rows={4}
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="e.g. Manila, Philippines"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-600 flex items-center gap-1">
              <Hash size={16} /> Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder='Type tags like "#Education #Environment #Community"'
            />
            {tagsInput && (
              <div className="flex flex-wrap mt-2 gap-2">
                {parseTags(tagsInput).map(tag => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-600 flex items-center gap-1">
              <UploadCloud size={16} /> Cover Image
            </label>
            <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
              {previewUrl ? (
                <div className="relative w-full h-40 rounded-md overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  Drag and drop or click to upload
                </p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-2 text-sm text-gray-600"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Problem"}
          </button>
        </form>
      </div>
    </div>
  )
}
