"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";
import Image from "next/image";
import { SyncClerkUser } from "./sync-clerk-user";

export function Header() {
  return (
    <header className="w-full border-b border-gray-200 py-3 px-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="relative w-80 h-18">
          <Image
            src="/assets/logo/logo-line.png"
            alt="Isumbong Mo Kay Devi Logo"
            fill
            className="object-cover"
          />
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
