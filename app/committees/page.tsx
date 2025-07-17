"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

export default function CommitteesPage() {
  const [committees, setCommittees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCommittees()
  }, [])

  const fetchCommittees = async () => {
    try {
      const response = await fetch("/api/committees")
      const data = await response.json()

      if (data.success) {
        setCommittees(data.committees)
      } else {
        setError("Failed to load committees")
      }
    } catch (error) {
      console.error("Error fetching committees:", error)
      setError("Failed to load committees")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Committees</h1>
            <p className="text-lg text-gray-600 mb-8">Loading committees...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Committees</h1>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Committees</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Learn about our various committees and the dedicated members who lead our community initiatives
          </p>
        </div>

        {/* Committees Count */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            {committees.length} Active Committee{committees.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Committees */}
        {committees.length > 0 ? (
          <div className="space-y-8">
            {committees.map((committee) => (
              <Card key={committee.id} className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="h-64 bg-gray-200 flex items-center justify-center">
                      {committee.image_url ? (
                        <img
                          src={committee.image_url || "/placeholder.svg"}
                          alt={committee.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">Committee Image</span>
                      )}
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-2xl">{committee.name}</CardTitle>
                          <CardDescription className="mt-2 text-base">
                            {committee.description || "No description available."}
                          </CardDescription>
                        </div>
                        <Badge variant={committee.is_active ? "default" : "secondary"}>
                          {committee.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2 text-gray-500" />
                          <span className="font-medium">Committee Members ({committee.members?.length || 0})</span>
                        </div>

                        {committee.members && committee.members.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {committee.members.map((member) => (
                              <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <Avatar>
                                  <AvatarImage src={member.image_url || "/placeholder.svg"} />
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-sm">{member.name}</div>
                                  <div className="text-xs text-gray-500">{member.position || "Member"}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                            No members assigned to this committee yet.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No committees found.</p>
            <p className="text-gray-400 text-sm mt-2">
              Committees will appear here once they are created by the admin.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
