"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Trash2, Users, UserPlus } from "lucide-react"

export default function CommitteesManagement() {
  const [committees, setCommittees] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [memberDialogOpen, setMemberDialogOpen] = useState(false)
  const [editingCommittee, setEditingCommittee] = useState(null)
  const [selectedCommittee, setSelectedCommittee] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true,
  })
  const [memberFormData, setMemberFormData] = useState({
    member_id: "",
    position: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    fetchCommittees()
    fetchMembers()
  }, [])

  const fetchCommittees = async () => {
    try {
      const response = await fetch("/api/admin/committees")
      const data = await response.json()
      if (data.success) {
        setCommittees(data.committees)
      }
    } catch (error) {
      console.error("Error fetching committees:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/admin/members")
      const data = await response.json()
      if (data.success) {
        setMembers(data.members.filter((m) => m.is_active))
      }
    } catch (error) {
      console.error("Error fetching members:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      let imageUrl = editingCommittee?.image_url || ""

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

      const url = editingCommittee ? `/api/admin/committees/${editingCommittee.id}` : "/api/admin/committees"
      const method = editingCommittee ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, image_url: imageUrl }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(editingCommittee ? "Committee updated successfully" : "Committee created successfully")
        setDialogOpen(false)
        resetForm()
        fetchCommittees()
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError("An error occurred")
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch(`/api/admin/committees/${selectedCommittee.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberFormData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Member added to committee successfully")
        setMemberDialogOpen(false)
        setMemberFormData({ member_id: "", position: "" })
        fetchCommittees()
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError("An error occurred")
    }
  }

  const handleRemoveMember = async (committeeId, memberId) => {
    if (!confirm("Are you sure you want to remove this member from the committee?")) return

    try {
      const response = await fetch(`/api/admin/committees/${committeeId}/members/${memberId}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (data.success) {
        fetchCommittees()
        setSuccess("Member removed from committee successfully")
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError("Error removing member")
    }
  }

  const handleDelete = async (committeeId) => {
    if (!confirm("Are you sure you want to delete this committee?")) return

    try {
      const response = await fetch(`/api/admin/committees/${committeeId}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (data.success) {
        fetchCommittees()
        setSuccess("Committee deleted successfully")
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError("Error deleting committee")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      is_active: true,
    })
    setEditingCommittee(null)
    setImageFile(null)
  }

  const openEditDialog = (committee) => {
    setEditingCommittee(committee)
    setFormData({
      name: committee.name,
      description: committee.description || "",
      is_active: committee.is_active,
    })
    setDialogOpen(true)
  }

  const openMemberDialog = (committee) => {
    setSelectedCommittee(committee)
    setMemberDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Committees Management</CardTitle>
              <CardDescription>Manage committees and their members</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Committee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingCommittee ? "Edit Committee" : "Add New Committee"}</DialogTitle>
                  <DialogDescription>
                    {editingCommittee ? "Update committee information" : "Create a new committee"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div>
                      <Label htmlFor="name">Committee Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="image">Committee Image</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      />
                      <Label htmlFor="is_active">Active Committee</Label>
                    </div>
                  </div>

                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingCommittee ? "Update" : "Create"}</Button>
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

          {loading ? (
            <div className="text-center py-4">Loading committees...</div>
          ) : (
            <div className="space-y-6">
              {committees.map((committee) => (
                <Card key={committee.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={committee.image_url || "/placeholder.svg"} />
                          <AvatarFallback>{committee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{committee.name}</CardTitle>
                          <CardDescription>{committee.description}</CardDescription>
                          <Badge variant={committee.is_active ? "default" : "secondary"} className="mt-2">
                            {committee.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => openMemberDialog(committee)}>
                          <UserPlus className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(committee)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(committee.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Committee Members ({committee.members?.length || 0})
                        </h4>
                      </div>
                      {committee.members && committee.members.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {committee.members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={member.image_url || "/placeholder.svg"} />
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-sm font-medium">{member.name}</div>
                                  <div className="text-xs text-gray-500">{member.position}</div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveMember(committee.id, member.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No members assigned to this committee.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Member Dialog */}
      <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member to Committee</DialogTitle>
            <DialogDescription>Add a member to {selectedCommittee?.name}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMember}>
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="member_id">Select Member</Label>
                <Select
                  value={memberFormData.member_id}
                  onValueChange={(value) => setMemberFormData({ ...memberFormData, member_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="position">Position/Role</Label>
                <Input
                  id="position"
                  value={memberFormData.position}
                  onChange={(e) => setMemberFormData({ ...memberFormData, position: e.target.value })}
                  placeholder="e.g., Chairman, Secretary, Member"
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setMemberDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Member</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
