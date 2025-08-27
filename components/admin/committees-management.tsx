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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Trash2, FileUp, FileText } from "lucide-react"

type CommitteeMember = {
  id: string
  name: string
  image_url?: string
  position?: string
  committee_member_id?: string
}

type Committee = {
  id: string
  name: string
  description?: string
  image_url?: string
  is_active: boolean
  members?: CommitteeMember[]
  pdf_url?: string
}

export default function CommitteesManagement() {
  const [committees, setCommittees] = useState<Committee[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCommittee, setEditingCommittee] = useState<Committee | null>(null)
  const [pdfUploadingId, setPdfUploadingId] = useState<string | null>(null)
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false)
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true,
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    fetchCommittees()
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

  // Members APIs are deprecated in favor of PDF upload for committees

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleUploadPdf = async (committee: Committee, file: File) => {
    setError("")
    setSuccess("")
    if (!file) return
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file")
      return
    }

    try {
      setPdfUploadingId(committee.id)

      // Direct upload to Cloudinary with server-generated signature
      const sigRes = await fetch("/api/cloudinary/signature")
      const sigData = await sigRes.json()
      if (!sigData.success) {
        setError(sigData.error || "Failed to get Cloudinary signature")
        setPdfUploadingId(null)
        return
      }

      const fd = new FormData()
      fd.append("file", file)
      fd.append("api_key", sigData.apiKey)
      fd.append("timestamp", String(sigData.timestamp))
      fd.append("signature", sigData.signature)
      fd.append("folder", sigData.folder)

      const cloudUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`
      const uploadResponse = await fetch(cloudUrl, { method: "POST", body: fd })
      const uploadData = await uploadResponse.json()
      if (!uploadResponse.ok || !uploadData.secure_url) {
        setError(uploadData.error?.message || "Failed to upload PDF")
        setPdfUploadingId(null)
        return
      }

      const updateResponse = await fetch(`/api/admin/committees/${committee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdf_url: uploadData.secure_url }),
      })
      const updateData = await updateResponse.json()
      if (updateData.success) {
        setSuccess("PDF uploaded successfully")
        fetchCommittees()
      } else {
        setError(updateData.error || "Failed to save PDF URL")
      }
    } catch (err) {
      setError("An error occurred while uploading PDF")
    } finally {
      setPdfUploadingId(null)
    }
  }

  const triggerPdfSelect = (committee: Committee) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/pdf"
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files && target.files[0]
      if (file) {
        // File size validation (25MB limit)
        const maxSize = 25 * 1024 * 1024 // 25MB in bytes
        if (file.size > maxSize) {
          setError("File size exceeds 25MB limit. Please choose a smaller PDF file.")
          return
        }
        handleUploadPdf(committee, file)
      }
    }
    // Append to body to ensure click works across browsers
    document.body.appendChild(input)
    input.click()
    // Clean up
    input.addEventListener("blur", () => {
      input.remove()
    })
  }

  const handleRemovePdf = async (committee: Committee) => {
    if (!confirm("Remove the PDF for this committee?")) return
    setError("")
    setSuccess("")
    try {
      setPdfUploadingId(committee.id)
      const updateResponse = await fetch(`/api/admin/committees/${committee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdf_url: null }),
      })
      const updateData = await updateResponse.json()
      if (updateData.success) {
        setSuccess("PDF removed successfully")
        fetchCommittees()
      } else {
        setError(updateData.error || "Failed to remove PDF")
      }
    } catch (err) {
      setError("An error occurred while removing PDF")
    } finally {
      setPdfUploadingId(null)
    }
  }

  // Member removal disabled as members view is replaced by PDF

  const handleDelete = async (committeeId: string) => {
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

  const openEditDialog = (committee: Committee) => {
    setEditingCommittee(committee)
    setFormData({
      name: committee.name,
      description: committee.description || "",
      is_active: committee.is_active,
    })
    setDialogOpen(true)
  }

  // Member dialog disabled

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Committees Management</CardTitle>
              <CardDescription>Manage committees and their PDF documents</CardDescription>
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
                         onChange={(e) => {
                           const files = e.target.files
                           setImageFile(files && files[0] ? files[0] : null)
                         }}
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
                         <Button 
                           size="sm" 
                           variant="outline" 
                           onClick={() => triggerPdfSelect(committee)} 
                           disabled={pdfUploadingId === committee.id}
                           title="Upload PDF (Max 25MB)"
                         >
                           <FileUp className="h-4 w-4 mr-1" />
                           {pdfUploadingId === committee.id ? "Uploading..." : "Upload PDF"}
                         </Button>
                         {committee.pdf_url && (
                           <Button size="sm" variant="outline" onClick={() => handleRemovePdf(committee)} disabled={pdfUploadingId === committee.id}>
                             Remove PDF
                           </Button>
                         )}
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
                          <FileText className="h-4 w-4 mr-2" />
                          Committee PDF
                        </h4>
                        {committee.pdf_url && (
                          <a
                            href={committee.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm underline"
                          >
                            Open in new tab
                          </a>
                        )}
                      </div>
                      {committee.pdf_url ? (
                        <div
                          className="relative border rounded overflow-hidden cursor-pointer group"
                          onClick={() => {
                            setSelectedPdfUrl(committee.pdf_url as string)
                            setPdfDialogOpen(true)
                          }}
                        >
                          <iframe src={committee.pdf_url} className="w-full h-[240px] pointer-events-none" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs">Click to enlarge</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No PDF uploaded yet. Use the upload button above.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Member dialog removed */}
      <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Committee Document</DialogTitle>
          </DialogHeader>
          {selectedPdfUrl && (
            <div className="border rounded">
              <iframe src={selectedPdfUrl} className="w-full h-[80vh]" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
