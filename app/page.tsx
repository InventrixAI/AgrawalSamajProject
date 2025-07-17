"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Calendar, Users, Award, Heart } from "lucide-react"

export default function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUpcomingEvents()
  }, [])

  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch("/api/events")
      const data = await response.json()

      if (data.success) {
        // Filter upcoming events and limit to 3
        const upcoming = data.events.filter((event) => new Date(event.event_date) > new Date()).slice(0, 3)
        setUpcomingEvents(upcoming)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Bilaspur Agrawal Sabha</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Preserving our heritage, building our future together as one community
          </p>
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
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Community</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connecting Agrawal families across Bilaspur through culture, tradition, and mutual support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Strong network of Agrawal families supporting each other</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Calendar className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Events</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Regular cultural and social events for all age groups</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Heritage</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Preserving and promoting our rich cultural traditions</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Helping community members in times of need</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-lg text-gray-600">Join us in our upcoming community gatherings</p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : upcomingEvents.length > 0 ? (
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
                    <Button className="bg-transparent" variant="outline">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">No upcoming events scheduled at the moment.</p>
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
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Become part of the Bilaspur Agrawal Sabha family and connect with your community
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
