// Local storage keys
const DRAFTS_KEY = 'distill_drafts'

interface Draft {
  id: string
  content: string
  outputFormat: string
  summary?: string
  updatedAt: number
}

export function getAllDrafts(): Draft[] {
  if (typeof window === 'undefined') return []
  const drafts = localStorage.getItem(DRAFTS_KEY)
  return drafts ? JSON.parse(drafts) : []
}

export function saveDraft(draft: Omit<Draft, 'id' | 'updatedAt'>): Draft {
  const drafts = getAllDrafts()
  const newDraft = {
    ...draft,
    id: generateId(),
    updatedAt: Date.now()
  }
  
  localStorage.setItem(DRAFTS_KEY, JSON.stringify([newDraft, ...drafts]))
  return newDraft
}

export function updateDraft(id: string, updates: Partial<Draft>): boolean {
  const drafts = getAllDrafts()
  const index = drafts.findIndex(d => d.id === id)
  
  if (index === -1) return false
  
  drafts[index] = {
    ...drafts[index],
    ...updates,
    updatedAt: Date.now()
  }
  
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts))
  return true
}

export function deleteDraft(id: string): boolean {
  const drafts = getAllDrafts()
  const filtered = drafts.filter(d => d.id !== id)
  
  if (filtered.length === drafts.length) return false
  
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(filtered))
  return true
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 24) {
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60)
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    }
    const hours = Math.floor(diffInHours)
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
} 