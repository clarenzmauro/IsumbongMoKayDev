import { User } from "lucide-react"
import Image from "next/image"

export function Header() {
  return (
    <header className="w-full border-b border-gray-200 py-3 px-3">
      <div className="flex items-center justify-between">
        <div className="relative w-80 h-18 bg-red-500">
          <Image src="/assets/logo/logo-line.png" alt="Isumbong Mo Kay Devi Logo" fill className="object-cover" />
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <User className="w-6 h-6 text-gray-800" />
        </button>
      </div>
    </header>
  )
}
