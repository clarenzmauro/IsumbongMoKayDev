"use client"

import { Header } from "@/app/components/header"
import { HeroSection } from "@/app/components/hero-section"
import { MainBody } from "@/app/components/main-body"
import { FloatingActionButton } from "@/app/components/floating-action-button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <HeroSection />
      <MainBody />
      <FloatingActionButton />
    </div>
  )
}
