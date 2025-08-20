"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type SabhaSadasyaPdf = {
  id: string;
  title: string;
  pdf_url: string;
  uploaded_at: string;
}

export default function AboutPage() {
  const [pdfs, setPdfs] = useState<SabhaSadasyaPdf[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false)
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await fetch("/api/admin/sabha-sadasya")
        const data = await response.json()
        if (data.success) {
          setPdfs(data.pdfs)
        } else {
          setError(data.error || "Failed to fetch PDFs")
        }
      } catch (err) {
        setError("An error occurred while fetching PDFs.")
      } finally {
        setLoading(false)
      }
    }
    fetchPdfs()
  }, [])

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">सभा सदस्य</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            
          </p>
        </div>

        {/* PDF Display Section */}
        <section className="mb-16">
          <Card>
            <br></br>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading PDFs...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">
                  Error: {error}
                </div>
              ) : pdfs.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No Sabha Sadasya PDFs available yet.
                </div>
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
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
