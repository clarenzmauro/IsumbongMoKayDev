import { Header } from "@/app/components/header"
import { HeroSection } from "@/app/components/hero-section"
import { MainBody } from "@/app/components/main-body"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <HeroSection />
      <MainBody />
    </div>
  )
}
