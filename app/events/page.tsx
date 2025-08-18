"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock } from "lucide-react"
import { AspectRatio } from "@/components/ui/aspect-ratio"

type EventItem = {
  id: string
  title: string
  description?: string
  event_date: string
  location?: string
  image_url?: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      const data = await response.json()

      if (data.success) {
        setEvents(data.events)
      } else {
        setError("Failed to load events")
      }
    } catch (error) {
      console.error("Error fetching events:", error)
      setError("Failed to load events")
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const isUpcoming = (eventDate: string) => {
    return new Date(eventDate) > new Date()
  }

  const upcomingEvents = events.filter((event) => isUpcoming(event.event_date))
  const pastEvents = events.filter((event) => !isUpcoming(event.event_date))

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Events</h1>
            <p className="text-lg text-gray-600 mb-8">Loading events...</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Events</h1>
            <p className="text-lg text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Events</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay updated with our community events, celebrations, and gatherings
          </p>
        </div>

        {/* Upcoming Events */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events ({upcomingEvents.length})</h2>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="bg-gray-200">
                    <AspectRatio ratio={148 / 210}>
                      {event.image_url ? (
                        <img
                          src={event.image_url || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-500">Event Image</span>
                        </div>
                      )}
                    </AspectRatio>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <Badge variant="secondary">Upcoming</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {event.description || "No description available."}
                    </CardDescription>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{formatTime(event.event_date)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    <br></br>

                    <p className="text-black-300 text-sm">इस कार्यक्रम में भाग लेगे हेतु
                      इस मोबाइल नंबर पर संपर्क करे : +919826517676 </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No upcoming events scheduled.</p>
              <p className="text-gray-400 text-sm mt-2">
                Check back later for new events or contact us for more information.
              </p>
            </div>
          )}
        </section>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Past Events ({pastEvents.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden opacity-75">
                  <div className="bg-gray-200">
                    <AspectRatio ratio={148 / 210}>
                      {event.image_url ? (
                        <img
                          src={event.image_url || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-500">Event Image</span>
                        </div>
                      )}
                    </AspectRatio>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {event.description || "No description available."}
                    </CardDescription>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{formatTime(event.event_date)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>

                    <Button variant="outline" className="w-full mt-4 bg-transparent">
                      View Gallery
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
