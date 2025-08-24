"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileUp, FileText, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type SadasyaSuchiPdf = {
  id: string;
  title: string;
  pdf_url: string;
  uploaded_at: string;
}

export default function SadasyaSuchiManagement() {
  const [pdfs, setPdfs] = useState<SadasyaSuchiPdf[]>([])
  const [loading, setLoading] = useState(true)
  const [pdfUploading, setPdfUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false)
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null)
  const [newPdfTitle, setNewPdfTitle] = useState("")
  const [newPdfFile, setNewPdfFile] = useState<File | null>(null)
  const [addPdfDialogOpen, setAddPdfDialogOpen] = useState(false)

  useEffect(() => {
    fetchPdfs()
  }, [])

  const fetchPdfs = async () => {
    try {
      const response = await fetch("/api/admin/sadasya-suchi")
      const data = await response.json()
      if (data.success) {
        setPdfs(data.pdfs)
      } else {
        setError(data.error || "Failed to fetch PDFs")
      }
    } catch (error) {
      console.error("Error fetching Sadasya Suchi PDFs:", error)
      setError("An error occurred while fetching PDFs.")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async () => {
    setError("")
    setSuccess("")
    if (!newPdfFile) {
      setError("Please select a PDF file.")
      return
    }
    if (!newPdfTitle.trim()) {
      setError("Please enter a title for the PDF.")
      return
    }
    if (newPdfFile.type !== "application/pdf") {
      setError("Please upload a PDF file.")
      return
    }

    try {
      setPdfUploading(true)
      const formData = new FormData()
      formData.append("file", newPdfFile)

      const uploadResponse = await fetch("/api/upload", { method: "POST", body: formData })
      const uploadData = await uploadResponse.json()
      if (!uploadData.success) {
        setError(uploadData.error || "Failed to upload PDF file")
        setPdfUploading(false)
        return
      }

      // Now save the PDF URL and title to your sadasya_suchi table
      const saveResponse = await fetch("/api/admin/sadasya-suchi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdf_url: uploadData.url, title: newPdfTitle }),
      })
      const saveData = await saveResponse.json()
      if (saveData.success) {
        setSuccess("PDF uploaded and saved successfully")
        setNewPdfFile(null)
        setNewPdfTitle("")
        setAddPdfDialogOpen(false)
        fetchPdfs()
      } else {
        setError(saveData.error || "Failed to save PDF information")
      }
    } catch (err) {
      setError("An error occurred during PDF upload and save.")
    } finally {
      setPdfUploading(false)
    }
  }

  const handleRemovePdf = async (id: string) => {
    if (!confirm("Are you sure you want to delete this PDF?")) return
    setError("")
    setSuccess("")
    try {
      const response = await fetch("/api/admin/sadasya-suchi", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await response.json()
      if (data.success) {
        setSuccess("PDF removed successfully")
        fetchPdfs()
      } else {
        setError(data.error || "Failed to remove PDF")
      }
    } catch (err) {
      setError("An error occurred while removing PDF.")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Sadasya Suchi Management</CardTitle>
              <CardDescription>Manage Sadasya Suchi PDF documents</CardDescription>
            </div>
            <Dialog open={addPdfDialogOpen} onOpenChange={setAddPdfDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setNewPdfFile(null);
                  setNewPdfTitle("");
                  setError("");
                  setAddPdfDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New PDF
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload New Sadasya Suchi PDF</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                  <div>
                    <Label htmlFor="pdfTitle">PDF Title</Label>
                    <Input
                      id="pdfTitle"
                      value={newPdfTitle}
                      onChange={(e) => setNewPdfTitle(e.target.value)}
                      placeholder="Enter PDF title" 
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pdfFile">PDF File</Label>
                    <Input
                      id="pdfFile"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setNewPdfFile(e.target.files ? e.target.files[0] : null)}
                      required
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setAddPdfDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleFileUpload} disabled={pdfUploading}>
                    {pdfUploading ? "Uploading..." : "Upload PDF"}
                  </Button>
                </DialogFooter>
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

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-4">Loading PDFs...</div>
          ) : pdfs.length === 0 ? (
            <p className="text-sm text-gray-500">No Sadasya Suchi PDFs uploaded yet. Use the "Add New PDF" button above.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pdfs.map((pdf) => (
                <Card key={pdf.id} className="relative group">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-md font-semibold line-clamp-1">{pdf.title}</CardTitle>
                    </div>
                    {/* <CardDescription className="text-sm line-clamp-2">{pdf.pdf_url}</CardDescription> */}
                    <div
                      className="relative border rounded overflow-hidden cursor-pointer group mt-4"
                      onClick={() => {
                        setSelectedPdfUrl(pdf.pdf_url);
                        setPdfDialogOpen(true);
                      }}
                    >
                      <iframe src={pdf.pdf_url} className="w-full h-[240px] pointer-events-none" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs">Click to enlarge</span>
                      </div>
                    </div>
                    <div className="flex justify-end items-center mt-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemovePdf(pdf.id)}
                        disabled={pdfUploading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>PDF Preview</DialogTitle>
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
