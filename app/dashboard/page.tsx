"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Phone, MapPin, Briefcase, Building, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"

export default function MemberDashboard() {
  const [members, setMembers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [selectedMember, setSelectedMember] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const membersPerPage = 50

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      fetchMembers()
    }
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/members")
      const data = await response.json()
      if (data.success) {
        setMembers(data.members)
      }
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = members.filter(
    (member) =>
      (member.family_head_name || member.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.firm_full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.business || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.gotra || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage)
  const startIndex = (currentPage - 1) * membersPerPage
  const endIndex = startIndex + membersPerPage
  const currentMembers = filteredMembers.slice(startIndex, endIndex)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const openMemberDialog = (member) => {
    setSelectedMember(member)
    setDialogOpen(true)
  }

  const goToPage = (page) => {
    setCurrentPage(page)
    // Scroll to members section
    const membersSection = document.getElementById("members-section")
    if (membersSection) {
      membersSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to view the member directory.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Member Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name || user.email}!</p>
        </div>

        {/* Members Section */}
        <div id="members-section">
          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Members Count and Pagination Info */}
          {!loading && (
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredMembers.length)} of {filteredMembers.length}{" "}
                members
              </p>
              {totalPages > 1 && (
                <p className="text-sm text-gray-500 mt-1">
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </div>
          )}

          {/* Members Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p>Loading members...</p>
            </div>
          ) : currentMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src={member.image_url || "/placeholder.svg"} />
                      <AvatarFallback>{(member.family_head_name || member.name || "U").charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{member.family_head_name || member.name}</CardTitle>
                    <Badge variant={member.is_active ? "default" : "secondary"}>
                      {member.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {member.firm_full_name && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="h-4 w-4 mr-2" />
                        {member.firm_full_name}
                      </div>
                    )}
                    {member.business && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase className="h-4 w-4 mr-2" />
                        {member.business}
                      </div>
                    )}
                    {member.mobile_no1 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {member.mobile_no1}
                      </div>
                    )}
                    {member.city && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {member.city}
                      </div>
                    )}
                    {member.total_members && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        {member.total_members} family member{member.total_members !== 1 ? "s" : ""}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 pt-2">
                      Member since: {new Date(member.membership_date || member.created_at).toLocaleDateString()}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 bg-transparent"
                      onClick={() => openMemberDialog(member)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm ? "No members found matching your search." : "No members found."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 text-orange-600 hover:text-orange-700 underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="flex items-center bg-transparent"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex space-x-1">
                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <Button variant={1 === currentPage ? "default" : "outline"} size="sm" onClick={() => goToPage(1)}>
                      1
                    </Button>
                    {currentPage > 4 && <span className="px-2 py-1 text-gray-500">...</span>}
                  </>
                )}

                {/* Pages around current page */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === currentPage ||
                      page === currentPage - 1 ||
                      page === currentPage + 1 ||
                      (currentPage <= 2 && page <= 3) ||
                      (currentPage >= totalPages - 1 && page >= totalPages - 2),
                  )
                  .map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </Button>
                  ))}

                {/* Last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && <span className="px-2 py-1 text-gray-500">...</span>}
                    <Button
                      variant={totalPages === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center bg-transparent"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>

        {/* Member Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Member Details</DialogTitle>
              <DialogDescription>
                Complete information for {selectedMember?.family_head_name || selectedMember?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedMember && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedMember.image_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">
                      {(selectedMember.family_head_name || selectedMember.name || "U").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedMember.family_head_name || selectedMember.name}</h3>
                    <p className="text-gray-600">{selectedMember.business}</p>
                    {selectedMember.gotra && <p className="text-sm text-gray-500">Gotra: {selectedMember.gotra}</p>}
                    <div className="flex space-x-2 mt-2">
                      <Badge variant={selectedMember.is_active ? "default" : "secondary"}>
                        {selectedMember.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {selectedMember.status && <Badge variant="outline">{selectedMember.status}</Badge>}
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="business">Business Info</TabsTrigger>
                    <TabsTrigger value="contact">Contact Info</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="font-semibold">Family Head Name</Label>
                        <p>{selectedMember.family_head_name || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">Total Family Members</Label>
                        <p>{selectedMember.total_members || 1}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="font-semibold">Home Address</Label>
                      <p>{selectedMember.home_address || "N/A"}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="font-semibold">City</Label>
                        <p>{selectedMember.city || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">District</Label>
                        <p>{selectedMember.district || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">State</Label>
                        <p>{selectedMember.state || "N/A"}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="font-semibold">Gotra</Label>
                      <p>{selectedMember.gotra || "N/A"}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="business" className="space-y-4">
                    <div>
                      <Label className="font-semibold">Firm Full Name</Label>
                      <p>{selectedMember.firm_full_name || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Business Type</Label>
                      <p>{selectedMember.business || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Firm Address</Label>
                      <p>{selectedMember.firm_address || "N/A"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="font-semibold">Firm Colony</Label>
                        <p>{selectedMember.firm_colony || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">Firm City</Label>
                        <p>{selectedMember.firm_city || "N/A"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="font-semibold">Firm District</Label>
                        <p>{selectedMember.firm_district || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">Firm State</Label>
                        <p>{selectedMember.firm_state || "N/A"}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4">
                    <div>
                      <Label className="font-semibold">Email</Label>
                      <p>{selectedMember.email || "N/A"}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="font-semibold">Mobile No 1</Label>
                        <p>{selectedMember.mobile_no1 || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">Mobile No 2</Label>
                        <p>{selectedMember.mobile_no2 || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">Mobile No 3</Label>
                        <p>{selectedMember.mobile_no3 || "N/A"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="font-semibold">Office Number</Label>
                        <p>{selectedMember.office_no || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">Phone Number</Label>
                        <p>{selectedMember.phone_no || "N/A"}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Member since:{" "}
                    {new Date(selectedMember.membership_date || selectedMember.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
