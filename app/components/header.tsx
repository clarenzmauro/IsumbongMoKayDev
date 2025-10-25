"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";
import Image from "next/image";
import { SyncClerkUser } from "./sync-clerk-user";

export function Header() {
  return (
    <header className="w-full border-b border-gray-200 py-2 px-2">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="relative h-10 sm:h-16">
          {/* Desktop Logo */}
          <div className="hidden sm:block relative w-80 h-full">
            <Image
              src="/assets/logo/logo-line.png"
              alt="Isumbong Mo Kay Dev Logo"
              fill
              sizes="(max-width: 640px) 100vw, 320px"
              className="object-contain"
              priority
            />
          </div>

          {/* Mobile Logo */}
          <div className="block sm:hidden relative w-12 h-12">
            <Image
              src="/assets/logo/cropped-transparent.png"
              alt="Isumbong Mo Kay Dev Logo (Mobile)"
              fill
              sizes="(max-width: 640px) 100vw, 48px"
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Auth Buttons */}
        <div>
          {/* When signed in, show user menu */}
          <SignedIn>
            <SyncClerkUser />
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          {/* When signed out, show sign-in button */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <User className="w-6 h-6 text-gray-800" />
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
