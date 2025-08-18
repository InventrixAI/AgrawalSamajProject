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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Edit, Trash2, Plus } from "lucide-react"

export default function EventsManagement() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    contact_person_name: "",
    contact_person_address: "",
    contact_person_mobile: "",
    is_active: true,
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/admin/events")
      const data = await response.json()
      if (data.success) {
        setEvents(data.events)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      let imageUrl = editingEvent?.image_url || ""

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

      const url = editingEvent ? `/api/admin/events/${editingEvent.id}` : "/api/admin/events"
      const method = editingEvent ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, image_url: imageUrl }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(editingEvent ? "Event updated successfully" : "Event created successfully")
        setDialogOpen(false)
        resetForm()
        fetchEvents()
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError("An error occurred")
    }
  }

  const handleDelete = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (data.success) {
        fetchEvents()
        setSuccess("Event deleted successfully")
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError("Error deleting event")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      event_date: "",
      location: "",
      contact_person_name: "",
      contact_person_address: "",
      contact_person_mobile: "",
      is_active: true,
    })
    setEditingEvent(null)
    setImageFile(null)
  }

  const openEditDialog = (event: any) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description || "",
      event_date: new Date(event.event_date).toISOString().slice(0, 16),
      location: event.location || "",
      contact_person_name: event.contact_person_name || "",
      contact_person_address: event.contact_person_address || "",
      contact_person_mobile: event.contact_person_mobile || "",
      is_active: event.is_active,
    })
    setDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Events Management</CardTitle>
            <CardDescription>Manage community events and programs</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
                <DialogDescription>
                  {editingEvent ? "Update event information" : "Create a new community event"}
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
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event_date">Event Date & Time</Label>
                      <Input
                        id="event_date"
                        type="datetime-local"
                        value={formData.event_date}
                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Contact Person Details */}
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-medium text-lg">Contact Person Details</h3>
                    
                    <div>
                      <Label htmlFor="contact_person_name">Contact Person Name</Label>
                      <Input
                        id="contact_person_name"
                        value={formData.contact_person_name}
                        onChange={(e) => setFormData({ ...formData, contact_person_name: e.target.value })}
                        placeholder="Enter contact person's name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact_person_address">Contact Person Address</Label>
                      <Textarea
                        id="contact_person_address"
                        value={formData.contact_person_address}
                        onChange={(e) => setFormData({ ...formData, contact_person_address: e.target.value })}
                        placeholder="Enter contact person's address"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact_person_mobile">Contact Person Mobile Number</Label>
                      <Input
                        id="contact_person_mobile"
                        value={formData.contact_person_mobile}
                        onChange={(e) => setFormData({ ...formData, contact_person_mobile: e.target.value })}
                        placeholder="Enter mobile number (e.g., +919826517676)"
                        type="tel"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image">Event Image</Label>
                    <Input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <Label htmlFor="is_active">Active Event</Label>
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingEvent ? "Update" : "Create"}</Button>
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
          <div className="text-center py-4">Loading events...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-500">{event.description?.slice(0, 50)}...</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(event.event_date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    <Badge variant={event.is_active ? "default" : "secondary"}>
                      {event.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(event)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(event.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
