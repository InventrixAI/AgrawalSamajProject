"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Calendar, Users, Award, Heart } from "lucide-react"
import ImageSlider from "@/components/image-slider"

export default function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [sliderImages, setSliderImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [scrollingNote, setScrollingNote] = useState<string | null>(null)

  useEffect(() => {
    fetchUpcomingEvents()
    fetchSliderImages()
    fetchScrollingNote()
  }, [])

  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch("/api/events")
      const data = await response.json()

      if (data.success) {
        // Filter upcoming events and limit to 3
        const upcoming = data.events.filter((event: any) => new Date(event.event_date) > new Date()).slice(0, 3)
        setUpcomingEvents(upcoming)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const fetchSliderImages = async () => {
    try {
      const response = await fetch("/api/home-images")
      const data = await response.json()

      if (data.success) {
        setSliderImages(data.images)
      }
    } catch (error) {
      console.error("Error fetching slider images:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchScrollingNote = async () => {
    try {
      const response = await fetch("/api/admin/scrolling-notes")
      const data = await response.json()
      if (data.success && data.note) {
        setScrollingNote(data.note.message)
      }
    } catch (error) {
      console.error("Error fetching scrolling note:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Image Slider  min-h-screen */}
      <section className="mb-0">
        {loading ? (
          <div className="w-full h-[500px] bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-xl">Loading...</p>
            </div>
          </div>
        ) : (
          <ImageSlider images={sliderImages} autoSlide={true} slideInterval={5000} />
        )}

        {/* Scrolling Note */}
        {scrollingNote && (
          <div className="w-full bg-yellow-400 py-3 overflow-hidden whitespace-nowrap">
            <div className="animate-marquee inline-block text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 px-4">
              {scrollingNote}
            </div>
          </div>
        )}

        {/* Call to Action Buttons */}
        {/* <div className="bg-gradient-to-r from-orange-500 to-red-600 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-x-4">
              <Link href="/register">
                <Button size="lg" variant="secondary">
                  Become a Member
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-orange-600 bg-transparent"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div> */}
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">हमारा समुदाय</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            संस्कृति, परंपरा और आपसी सहयोग के माध्यम से बिलासपुर भर के अग्रवाल परिवारों को जोड़ना
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>समुदाय</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>बिलासपुर अग्रवाल समाज आपसी भाईचारे एवं मेलजोल एवं आपसी सहयोग पर कार्य करता है।</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Calendar className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>कार्यक्रम</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>बिलासपुर अग्रवाल समाज समय-समय पर सामाजिक/सांस्कृतिक कार्यक्रम करते हैं</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>हमारी विरासत</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>हम अग्रवालों की विरासत लगभग 5000 वर्ष पुरानी श्री अग्रसेन महाराज के वंशज हैं हम जो सिर्फ सेवा और सहयोग पर कार्य करते हैं</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>सहयोग</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>सभी को सहयोग और सहायता पर हम कार्य करते है</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">आगामी कार्यक्रम</h2>
            <p className="text-lg text-gray-600">हमारे आगामी सामुदायिक समारोहों में शामिल हों</p>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{formatDate(event.event_date)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {event.description?.slice(0, 100)}
                      {event.description?.length > 100 ? "..." : ""}
                    </p>
                    {/*<Button className="bg-transparent" variant="outline">
                      Learn More
                    </Button>*/}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">फिलहाल कोई आगामी कार्यक्रम निर्धारित नहीं है।</p>
              <p className="text-gray-500 text-sm mt-2">Check back later for new events!</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/events">
              <Button>View All Events</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">क्या आप हमारे समुदाय में शामिल होने के लिए तैयार हैं?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
          बिलासपुर अग्रवाल सभा परिवार का हिस्सा बनें और अपने समुदाय से जुड़ें।
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Register Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
