"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getAllDrafts, deleteDraft, formatDate } from "@/lib/drafts"
import { Trash2, Clock, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DraftsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectDraft: (draft: any) => void
}

export function DraftsDialog({ open, onOpenChange, onSelectDraft }: DraftsDialogProps) {
  const [drafts, setDrafts] = React.useState<any[]>([])
  const { toast } = useToast()

  React.useEffect(() => {
    if (open) {
      setDrafts(getAllDrafts())
    }
  }, [open])

  const handleDelete = (id: string) => {
    if (deleteDraft(id)) {
      setDrafts(drafts.filter(d => d.id !== id))
      toast({
        title: "Draft deleted",
        description: "Your draft has been deleted",
        variant: "success",
      })
    }
  }

  const getFormatLabel = (format: string) => {
    const labels: Record<string, string> = {
      summary: 'Summary',
      bullets: 'Bullet Points',
      takeaways: 'Key Takeaways',
      tweet: 'Tweet',
      thread: 'Thread',
      linkedin: 'LinkedIn Post'
    }
    return labels[format] || format
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Your Drafts</DialogTitle>
          <DialogDescription>
            View and manage your saved drafts
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          {drafts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
              <FileText className="h-12 w-12 mb-4 opacity-50" />
              <p>No drafts yet</p>
              <p className="text-sm">Your saved drafts will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="flex items-start justify-between p-4 rounded-lg border bg-white/50 hover:bg-white/80 transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(draft.updatedAt)}
                    </div>
                    <div className="truncate font-medium mb-1">
                      {draft.content.slice(0, 100)}...
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {getFormatLabel(draft.outputFormat)}
                      </span>
                      {draft.summary && (
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">
                          Processed
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(draft.id)}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onSelectDraft(draft)
                        onOpenChange(false)
                      }}
                    >
                      Load
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 