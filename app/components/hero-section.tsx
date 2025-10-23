import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const images = [
  "/assets/images/img1.jpg",
  "/assets/images/img2.jpg",
  "/assets/images/img3.jpg",
  "/assets/images/img4.jpg",
  "/assets/images/img5.jpg",
  "/assets/images/img6.jpg",
]

export function HeroSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      {/* Slideshow Background */}
      <AnimatePresence>
        <motion.div
          key={images[current]}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <Image
            src={images[current]}
            alt={`Slide ${current + 1}`}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Translucent Overlay */}
      <div className="absolute inset-0 bg-black/65 z-10" />

      {/* Text Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h1 className="text-white text-3xl md:text-5xl font-extrabold tracking-wide leading-tight">
          Help us to Create Solutions, By Voicing out the Problems
        </h1>
        <p className="text-gray-200 mt-4 text-lg md:text-2xl font-medium">
          Develop with Purpose, Digitally for the Country
        </p>
      </div>
    </section>
  )
}