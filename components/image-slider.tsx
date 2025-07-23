"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SliderImage {
  id: string
  title?: string
  description?: string
  image_url: string
  display_order: number
}

interface ImageSliderProps {
  images: SliderImage[]
  autoSlide?: boolean
  slideInterval?: number
}

export default function ImageSlider({ images, autoSlide = true, slideInterval = 5000 }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoSlide || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, slideInterval)

    return () => clearInterval(interval)
  }, [autoSlide, slideInterval, images.length])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-96 bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Welcome to Bilaspur Agrawal Sabha</h2>
          <p className="text-xl">No slider images configured</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[700px] overflow-hidden rounded-lg shadow-lg">
      {/* Images */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={image.id} className="w-full h-full flex-shrink-0 relative">
            <img
              src={image.image_url || "/placeholder.svg?height=700&width=1200"}
              alt={image.title || `Slide ${index + 1}`}
              className="w-full h-full object-contain"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl">
                {image.title && <h2 className="text-4xl md:text-6xl font-bold mb-4">{image.title}</h2>}
                {image.description && <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">{image.description}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
