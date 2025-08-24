"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, UserCheck, Settings } from "lucide-react"
import { ImageIcon } from "lucide-react"
import MembersManagement from "@/components/admin/members-management"
import EventsManagement from "@/components/admin/events-management"
import CommitteesManagement from "@/components/admin/committees-management"
import UsersManagement from "@/components/admin/users-management"
import HomeImagesManagement from "@/components/admin/home-images-management"
import SabhaSadasyaManagement from "@/components/admin/sabha-sadasya-management"
import PatraPatrikaenManagement from "@/components/admin/patra-patrikaen-management"
import SadasyaSuchiManagement from "@/components/admin/sadasya-suchi-management"
import ScrollingNoteManagement from "@/components/admin/scrolling-note-management"

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingApprovals: 0,
    totalEvents: 0,
    totalCommittees: 0,
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== "admin") {
        window.location.href = "/dashboard"
        return
      }
      setUser(parsedUser)
      fetchStats()
    } else {
      window.location.href = "/login"
    }
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your community platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Committees</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCommittees}</div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Home Images</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Manage Home Images</div>
            </CardContent>
          </Card> */}
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="committees">Committees</TabsTrigger>
            <TabsTrigger value="home-images">Home Images</TabsTrigger>
            <TabsTrigger value="sabha-sadasya">सभा सदस्य</TabsTrigger>
            <TabsTrigger value="patra-patrikaen">पत्र पत्रिकाएँ</TabsTrigger>
            <TabsTrigger value="sadasya-suchi">समाज सूची</TabsTrigger>
            <TabsTrigger value="scrolling-note">नोट</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="members">
            <MembersManagement />
          </TabsContent>

          <TabsContent value="events">
            <EventsManagement />
          </TabsContent>

          <TabsContent value="committees">
            <CommitteesManagement />
          </TabsContent>

          <TabsContent value="home-images">
            <HomeImagesManagement />
          </TabsContent>

          <TabsContent value="sabha-sadasya">
            <SabhaSadasyaManagement />
          </TabsContent>

          <TabsContent value="patra-patrikaen">
            <PatraPatrikaenManagement />
          </TabsContent>

          <TabsContent value="sadasya-suchi">
            <SadasyaSuchiManagement />
          </TabsContent>

          <TabsContent value="scrolling-note">
            <ScrollingNoteManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
