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
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, ImageIcon } from "lucide-react"

export default function HomeImagesManagement() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    display_order: 1,
    is_active: true,
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/admin/home-images")
      const data = await response.json()
      if (data.success) {
        setImages(data.images)
      }
    } catch (error) {
      console.error("Error fetching images:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      let imageUrl = editingImage?.image_url || ""

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
        } else {
          setError("Failed to upload image")
          return
        }
      }

      if (!imageUrl && !editingImage) {
        setError("Please select an image")
        return
      }

      const url = editingImage ? `/api/admin/home-images/${editingImage.id}` : "/api/admin/home-images"
      const method = editingImage ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, image_url: imageUrl }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(editingImage ? "Image updated successfully" : "Image added successfully")
        setDialogOpen(false)
        resetForm()
        fetchImages()
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError("An error occurred")
    }
  }

  const handleDelete = async (imageId) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const response = await fetch(`/api/admin/home-images/${imageId}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (data.success) {
        fetchImages()
        setSuccess("Image deleted successfully")
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError("Error deleting image")
    }
  }

  const handleReorder = async (imageId, direction) => {
    try {
      const response = await fetch(`/api/admin/home-images/${imageId}/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
      })

      const data = await response.json()
      if (data.success) {
        fetchImages()
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError("Error reordering image")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      display_order: images.length + 1,
      is_active: true,
    })
    setEditingImage(null)
    setImageFile(null)
  }

  const openEditDialog = (image) => {
    setEditingImage(image)
    setFormData({
      title: image.title || "",
      description: image.description || "",
      display_order: image.display_order,
      is_active: image.is_active,
    })
    setDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Home Page Images</CardTitle>
            <CardDescription>Manage the image slider on the home page</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingImage ? "Edit Image" : "Add New Image"}</DialogTitle>
                <DialogDescription>
                  {editingImage ? "Update image information" : "Add a new image to the home page slider"}
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
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Image title (optional)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Image description (optional)"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">Image *</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      required={!editingImage}
                    />
                    <p className="text-sm text-gray-500 mt-1">Recommended size: 1200x500px for best results</p>
                  </div>

                  <div>
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      min="1"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <Label htmlFor="is_active">Active (show in slider)</Label>
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingImage ? "Update" : "Add"}</Button>
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
          <div className="text-center py-4">Loading images...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {images.map((image, index) => (
                <TableRow key={image.id}>
                  <TableCell>
                    <div className="w-20 h-12 bg-gray-200 rounded overflow-hidden">
                      {image.image_url ? (
                        <img
                          src={image.image_url || "/placeholder.svg"}
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{image.title || "Untitled"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {image.description || "No description"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span>{image.display_order}</span>
                      <div className="flex flex-col">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0"
                          onClick={() => handleReorder(image.id, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0"
                          onClick={() => handleReorder(image.id, "down")}
                          disabled={index === images.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={image.is_active ? "default" : "secondary"}>
                      {image.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(image)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(image.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {images.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No images added yet. Add your first image to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
