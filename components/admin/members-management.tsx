"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MembersManagement() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [viewingMember, setViewingMember] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    firm_full_name: "",
    family_head_name: "",
    firm_address: "",
    firm_colony: "",
    firm_state: "",
    firm_district: "",
    firm_city: "",
    home_address: "",
    state: "",
    district: "",
    city: "",
    business: "",
    mobile_no1: "",
    mobile_no2: "",
    mobile_no3: "",
    office_no: "",
    phone_no: "",
    email: "",
    gotra: "",
    total_members: 1,
    status: "active",
    is_active: true,
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const membersPerPage = 50

  useEffect(() => {
    fetchMembers()
  }, [])

  // Pagination logic
  const totalPages = Math.ceil(members.length / membersPerPage)
  const startIndex = (currentPage - 1) * membersPerPage
  const endIndex = startIndex + membersPerPage
  const currentMembers = members.slice(startIndex, endIndex)

  // Reset to first page when members data changes
  useEffect(() => {
    setCurrentPage(1)
  }, [members])

  const goToPage = (page) => {
    setCurrentPage(page)
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

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/admin/members")
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      let imageUrl = editingMember?.image_url || ""

      // Handle image upload if file is selected
      if (imageFile) {
        const imageFormData = new FormData()
        imageFormData.append("file", imageFile)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        })

        const uploadData = await uploadResponse.json()
        if (uploadData.success) {
          imageUrl = uploadData.url
        }
      }

      const url = editingMember ? `/api/admin/members/${editingMember.id}` : "/api/admin/members"
      const method = editingMember ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, image_url: imageUrl }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(editingMember ? "Member updated successfully" : "Member created successfully")
        setDialogOpen(false)
        resetForm()
        fetchMembers()
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError("An error occurred")
    }
  }

  const handleDelete = async (memberId) => {
    if (!confirm("Are you sure you want to delete this member?")) return

    try {
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (data.success) {
        fetchMembers()
        setSuccess("Member deleted successfully")
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError("Error deleting member")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      firm_full_name: "",
      family_head_name: "",
      firm_address: "",
      firm_colony: "",
      firm_state: "",
      firm_district: "",
      firm_city: "",
      home_address: "",
      state: "",
      district: "",
      city: "",
      business: "",
      mobile_no1: "",
      mobile_no2: "",
      mobile_no3: "",
      office_no: "",
      phone_no: "",
      email: "",
      gotra: "",
      total_members: 1,
      status: "active",
      is_active: true,
    })
    setEditingMember(null)
    setImageFile(null)
  }

  const openEditDialog = (member) => {
    setEditingMember(member)
    setFormData({
      name: member.name || "",
      firm_full_name: member.firm_full_name || "",
      family_head_name: member.family_head_name || "",
      firm_address: member.firm_address || "",
      firm_colony: member.firm_colony || "",
      firm_state: member.firm_state || "",
      firm_district: member.firm_district || "",
      firm_city: member.firm_city || "",
      home_address: member.home_address || "",
      state: member.state || "",
      district: member.district || "",
      city: member.city || "",
      business: member.business || "",
      mobile_no1: member.mobile_no1 || "",
      mobile_no2: member.mobile_no2 || "",
      mobile_no3: member.mobile_no3 || "",
      office_no: member.office_no || "",
      phone_no: member.phone_no || "",
      email: member.email || "",
      gotra: member.gotra || "",
      total_members: member.total_members || 1,
      status: member.status || "active",
      is_active: member.is_active,
    })
    setDialogOpen(true)
  }

  const openViewDialog = (member) => {
    setViewingMember(member)
    setViewDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Members Management</CardTitle>
            <CardDescription>Manage community members with detailed information</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingMember ? "Edit Member" : "Add New Member"}</DialogTitle>
                <DialogDescription>
                  {editingMember ? "Update member information" : "Add a new community member"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="business">Business</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="other">Other</TabsTrigger>
                  </TabsList>

                  <div className="mt-4">
                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <TabsContent value="personal" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Display Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Display name for the member"
                          />
                        </div>
                        <div>
                          <Label htmlFor="family_head_name">Family Head Name *</Label>
                          <Input
                            id="family_head_name"
                            value={formData.family_head_name}
                            onChange={(e) => setFormData({ ...formData, family_head_name: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="home_address">Home Address</Label>
                        <Textarea
                          id="home_address"
                          value={formData.home_address}
                          onChange={(e) => setFormData({ ...formData, home_address: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="district">District</Label>
                          <Input
                            id="district"
                            value={formData.district}
                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="gotra">Gotra</Label>
                          <Input
                            id="gotra"
                            value={formData.gotra}
                            onChange={(e) => setFormData({ ...formData, gotra: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="total_members">Total Family Members</Label>
                          <Input
                            id="total_members"
                            type="number"
                            min="1"
                            value={formData.total_members}
                            onChange={(e) =>
                              setFormData({ ...formData, total_members: Number.parseInt(e.target.value) })
                            }
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="business" className="space-y-4">
                      <div>
                        <Label htmlFor="firm_full_name">Firm Full Name</Label>
                        <Input
                          id="firm_full_name"
                          value={formData.firm_full_name}
                          onChange={(e) => setFormData({ ...formData, firm_full_name: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="business">Business Type</Label>
                        <Input
                          id="business"
                          value={formData.business}
                          onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="firm_address">Firm Address</Label>
                        <Textarea
                          id="firm_address"
                          value={formData.firm_address}
                          onChange={(e) => setFormData({ ...formData, firm_address: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firm_colony">Firm Colony</Label>
                          <Input
                            id="firm_colony"
                            value={formData.firm_colony}
                            onChange={(e) => setFormData({ ...formData, firm_colony: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="firm_city">Firm City</Label>
                          <Input
                            id="firm_city"
                            value={formData.firm_city}
                            onChange={(e) => setFormData({ ...formData, firm_city: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firm_district">Firm District</Label>
                          <Input
                            id="firm_district"
                            value={formData.firm_district}
                            onChange={(e) => setFormData({ ...formData, firm_district: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="firm_state">Firm State</Label>
                          <Input
                            id="firm_state"
                            value={formData.firm_state}
                            onChange={(e) => setFormData({ ...formData, firm_state: e.target.value })}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="mobile_no1">Mobile No 1</Label>
                          <Input
                            id="mobile_no1"
                            value={formData.mobile_no1}
                            onChange={(e) => setFormData({ ...formData, mobile_no1: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="mobile_no2">Mobile No 2</Label>
                          <Input
                            id="mobile_no2"
                            value={formData.mobile_no2}
                            onChange={(e) => setFormData({ ...formData, mobile_no2: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="mobile_no3">Mobile No 3</Label>
                          <Input
                            id="mobile_no3"
                            value={formData.mobile_no3}
                            onChange={(e) => setFormData({ ...formData, mobile_no3: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="office_no">Office Number</Label>
                          <Input
                            id="office_no"
                            value={formData.office_no}
                            onChange={(e) => setFormData({ ...formData, office_no: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone_no">Phone Number</Label>
                          <Input
                            id="phone_no"
                            value={formData.phone_no}
                            onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="other" className="space-y-4">
                      <div>
                        <Label htmlFor="image">Profile Image</Label>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files[0])}
                        />
                      </div>

                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_active"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        />
                        <Label htmlFor="is_active">Active Member</Label>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>

                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingMember ? "Update" : "Create"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-4">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Members Count and Pagination Info */}
        {!loading && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, members.length)} of {members.length} members
            </p>
            {totalPages > 1 && (
              <p className="text-sm text-gray-500 mt-1">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">Loading members...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Family Head</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={member.image_url || "/placeholder.svg"} />
                          <AvatarFallback>{(member.family_head_name || member.name || "U").charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name || member.family_head_name}</div>
                          <div className="text-sm text-gray-500">{member.gotra && `Gotra: ${member.gotra}`}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{member.family_head_name}</div>
                        <div className="text-sm text-gray-500">
                          {member.total_members} family member{member.total_members !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{member.firm_full_name || "N/A"}</div>
                        <div className="text-sm text-gray-500">{member.business}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {member.mobile_no1 && <div>{member.mobile_no1}</div>}
                        {member.email && <div className="text-gray-500">{member.email}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {member.city && <div>{member.city}</div>}
                        {member.state && <div className="text-gray-500">{member.state}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant={member.is_active ? "default" : "secondary"}>
                          {member.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {/* <Badge variant="outline" className="text-xs">
                          {member.status}
                        </Badge> */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => openViewDialog(member)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(member)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(member.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
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
          </>
        )}

        {members.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No members added yet. Add your first member to get started!</p>
          </div>
        )}

        {/* View Member Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Member Details</DialogTitle>
              <DialogDescription>
                Complete information for {viewingMember?.family_head_name || viewingMember?.name}
              </DialogDescription>
            </DialogHeader>
            {viewingMember && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={viewingMember.image_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">
                      {(viewingMember.family_head_name || viewingMember.name || "U").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold">{viewingMember.family_head_name || viewingMember.name}</h3>
                    <p className="text-gray-600">{viewingMember.business}</p>
                    {viewingMember.gotra && <p className="text-sm text-gray-500">Gotra: {viewingMember.gotra}</p>}
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
                        <p>{viewingMember.family_head_name || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">Total Family Members</Label>
                        <p>{viewingMember.total_members || 1}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="font-semibold">Home Address</Label>
                      <p>{viewingMember.home_address || "N/A"}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="font-semibold">City</Label>
                        <p>{viewingMember.city || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">District</Label>
                        <p>{viewingMember.district || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">State</Label>
                        <p>{viewingMember.state || "N/A"}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="business" className="space-y-4">
                    <div>
                      <Label className="font-semibold">Firm Full Name</Label>
                      <p>{viewingMember.firm_full_name || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Business Type</Label>
                      <p>{viewingMember.business || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Firm Address</Label>
                      <p>{viewingMember.firm_address || "N/A"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="font-semibold">Firm Colony</Label>
                        <p>{viewingMember.firm_colony || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">Firm City</Label>
                        <p>{viewingMember.firm_city || "N/A"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="font-semibold">Firm District</Label>
                        <p>{viewingMember.firm_district || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">Firm State</Label>
                        <p>{viewingMember.firm_state || "N/A"}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4">
                    <div>
                      <Label className="font-semibold">Email</Label>
                      <p>{viewingMember.email || "N/A"}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="font-semibold">Mobile No 1</Label>
                        <p>{viewingMember.mobile_no1 || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">Mobile No 2</Label>
                        <p>{viewingMember.mobile_no2 || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">Mobile No 3</Label>
                        <p>{viewingMember.mobile_no3 || "N/A"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="font-semibold">Office Number</Label>
                        <p>{viewingMember.office_no || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">Phone Number</Label>
                        <p>{viewingMember.phone_no || "N/A"}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex space-x-2">
                    <Badge variant={viewingMember.is_active ? "default" : "secondary"}>
                      {viewingMember.is_active ? "Active" : "Inactive"}
                    </Badge>
                    {/* <Badge variant="outline">{viewingMember.status}</Badge> */}
                  </div>
                  <div className="text-sm text-gray-500">
                    Member since:{" "}
                    {new Date(viewingMember.membership_date || viewingMember.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
