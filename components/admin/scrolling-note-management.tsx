"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Edit, Trash2, Plus } from "lucide-react"

type ScrollingNote = {
  id: string;
  message: string;
  updated_at: string;
}

export default function ScrollingNoteManagement() {
  const [note, setNote] = useState<ScrollingNote | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [messageContent, setMessageContent] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchNote()
  }, [])

  const fetchNote = async () => {
    try {
      const response = await fetch("/api/admin/scrolling-notes")
      const data = await response.json()
      if (data.success) {
        setNote(data.note)
        setMessageContent(data.note ? data.note.message : "")
      } else {
        setError(data.error || "Failed to fetch scrolling note")
      }
    } catch (error) {
      console.error("Error fetching scrolling note:", error)
      setError("An error occurred while fetching the scrolling note.")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setError("")
    setSuccess("")
    if (!messageContent.trim()) {
      setError("Message cannot be empty.")
      return
    }

    try {
      setSaving(true)
      const response = await fetch("/api/admin/scrolling-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageContent }),
      })
      const data = await response.json()
      if (data.success) {
        setSuccess("Scrolling note saved successfully")
        setNote(data.note)
        setEditing(false)
        fetchNote()
      } else {
        setError(data.error || "Failed to save scrolling note")
      }
    } catch (err) {
      setError("An error occurred while saving the scrolling note.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this scrolling note?")) return
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/admin/scrolling-notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()
      if (data.success) {
        setSuccess("Scrolling note deleted successfully")
        setNote(null)
        setMessageContent("")
        setEditing(false)
      } else {
        setError(data.error || "Failed to delete scrolling note")
      }
    } catch (err) {
      setError("An error occurred while deleting the scrolling note.")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Scrolling Note Management</CardTitle>
              <CardDescription>Manage the single scrolling information note for the homepage.</CardDescription>
            </div>
            {!loading && !note && !editing && (
              <Button onClick={() => setEditing(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Note
              </Button>
            )}
            {!loading && note && !editing && (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Note
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={saving}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert className="mb-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-4">Loading note...</div>
          ) : editing ? (
            <div className="space-y-4">
              <Label htmlFor="note-content">Note Content</Label>
              <Textarea
                id="note-content"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={5}
                placeholder="Enter the scrolling message here..."
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Note"}
                </Button>
              </div>
            </div>
          ) : note ? (
            <div className="border rounded p-4 bg-yellow-50 text-yellow-800 font-bold text-lg">
              {note.message}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No scrolling note configured yet. Click "Create Note" to add one.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
