"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Copy, Check, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

type ContentType = 'url' | 'youtube' | 'text'
type OutputFormat = 'summary' | 'bullets' | 'takeaways' | 'tweet' | 'thread' | 'linkedin'

const OUTPUT_FORMATS = {
  summary: {
    label: 'Detailed Summary',
    description: 'A comprehensive summary of the main points',
    icon: '📝'
  },
  bullets: {
    label: 'Bullet Points',
    description: 'Key points in a bullet-point format',
    icon: '•'
  },
  takeaways: {
    label: 'Key Takeaways',
    description: 'Essential insights and learnings',
    icon: '💡'
  },
  tweet: {
    label: 'Tweet',
    description: 'Concise summary in 280 characters',
    icon: '🐦'
  },
  thread: {
    label: 'Twitter Thread',
    description: 'A series of connected tweets',
    icon: '🧵'
  },
  linkedin: {
    label: 'LinkedIn Post',
    description: 'Professional post optimized for LinkedIn engagement',
    icon: '💼'
  }
}

export default function Home() {
  const [content, setContent] = useState("")
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [contentType, setContentType] = useState<ContentType>('url')
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('summary')
  const [isCopied, setIsCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [hashtags, setHashtags] = useState<string>("")
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setIsCopied(true)
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
        variant: "success",
      })
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const getCharacterCount = () => {
    if (!summary) return 0
    return summary.length
  }

  const getCharacterLimit = () => {
    switch (outputFormat) {
      case 'tweet':
        return 280
      case 'linkedin':
        return 1300
      default:
        return null
    }
  }

  const getInputCharacterCount = () => {
    if (!content) return 0
    return content.length
  }

  const getInputCharacterLimit = () => {
    switch (contentType) {
      case 'text':
        return 25000 // Reasonable limit for direct text input
      default:
        return null
    }
  }

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter content to distill",
      })
      return
    }

    setIsLoading(true)
    setSummary("")
    setHashtags("")

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          content,
          contentType,
          outputFormat
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate summary")
      }

      setSummary(data.summary)
      if (data.hashtags) {
        setHashtags(data.hashtags)
      }
      
      toast({
        variant: "success",
        title: "Success",
        description: "Content successfully distilled!",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "An error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    if (outputFormat === 'linkedin') {
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(summary)}`
      window.open(linkedInUrl, '_blank')
      toast({
        title: "Opening LinkedIn",
        description: "Ready to share your post",
        variant: "success",
      })
    }
  }

  const renderPreview = () => {
    if (!summary || !['linkedin', 'tweet', 'thread'].includes(outputFormat)) return null

    return (
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mt-4">
        <CardHeader>
          <CardTitle className="text-lg">Preview</CardTitle>
          <CardDescription>
            How your post will look on {
              outputFormat === 'linkedin' ? 'LinkedIn' :
              outputFormat === 'tweet' ? 'Twitter' : 'Twitter Thread'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "rounded-lg border p-4 bg-white",
            outputFormat === 'linkedin' ? 'prose max-w-none' : 'font-sans'
          )}>
            {outputFormat === 'linkedin' ? (
              <div className="space-y-4">
                {summary.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-gray-800">{paragraph}</p>
                ))}
                {hashtags && (
                  <div className="pt-4 border-t">
                    <p className="text-gray-600 text-sm">
                      {hashtags.split(' ').map((tag, i) => (
                        <span key={i} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                          {tag}
                        </span>
                      ))}
                    </p>
                  </div>
                )}
              </div>
            ) : outputFormat === 'tweet' ? (
              <div className="font-sans text-gray-800">
                {summary}
              </div>
            ) : (
              <div className="space-y-4">
                {summary.split('\n').map((tweet, i) => (
                  <div key={i} className="pb-4 border-b last:border-0">
                    {tweet}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 right-0 h-96 w-96 rounded-full bg-purple-100/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block">
            <h1 className="text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 sm:text-7xl">
              Distill
            </h1>
            <div className="h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mt-2" />
          </div>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Transform lengthy content into clear, actionable insights. From articles to videos, get to the essence in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Step 1: Choose Content Type
                </CardTitle>
                <CardDescription>
                  Select how you want to input your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="url" onValueChange={(value) => setContentType(value as ContentType)}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="url">Web Article</TabsTrigger>
                    <TabsTrigger value="youtube">YouTube Video</TabsTrigger>
                    <TabsTrigger value="text">Direct Text</TabsTrigger>
                  </TabsList>
                  <TabsContent value="url" className="mt-0">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Paste the URL of any web article or blog post</p>
                      <Textarea
                        placeholder="https://example.com/article"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="h-24"
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="youtube" className="mt-0">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Paste a YouTube video URL</p>
                      <Textarea
                        placeholder="https://youtube.com/watch?v=..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="h-24"
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="text" className="mt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">Paste or type any text content</p>
                        {getInputCharacterLimit() && (
                          <span className={cn(
                            "text-sm",
                            getInputCharacterCount() > getInputCharacterLimit()! 
                              ? "text-red-500" 
                              : "text-gray-500"
                          )}>
                            {getInputCharacterCount()}/{getInputCharacterLimit()} characters
                          </span>
                        )}
                      </div>
                      <Textarea
                        placeholder="Enter your text here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[200px]"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Step 2: Choose Output Format
                </CardTitle>
                <CardDescription>
                  Select how you want your content distilled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  defaultValue="summary"
                  onValueChange={(value) => setOutputFormat(value as OutputFormat)}
                  className="grid grid-cols-1 gap-4"
                >
                  {Object.entries(OUTPUT_FORMATS).map(([key, format]) => (
                    <Label
                      key={key}
                      className={`flex items-center space-x-3 space-y-0 rounded-lg border p-4 hover:bg-gray-50 cursor-pointer ${
                        outputFormat === key ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200'
                      }`}
                    >
                      <RadioGroupItem value={key} id={key} className="sr-only" />
                      <span className="text-xl">{format.icon}</span>
                      <div className="space-y-1">
                        <p className="text-base font-medium leading-none">{format.label}</p>
                        <p className="text-sm text-gray-500">{format.description}</p>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t bg-gradient-to-b from-white/50 to-gray-50/50 rounded-b-lg pt-6">
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                  <p className="text-sm text-gray-600">
                    {isLoading ? 'Processing...' : 'Ready to process'}
                  </p>
                </div>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Distilling...
                    </>
                  ) : (
                    "Distill Content"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:sticky lg:top-8 space-y-6">
            {summary ? (
              <>
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="space-y-1 pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        {OUTPUT_FORMATS[outputFormat].icon} {OUTPUT_FORMATS[outputFormat].label}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {outputFormat === 'linkedin' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleShare}
                            className="h-8 w-8"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCopy}
                          className="h-8 w-8"
                        >
                          {isCopied ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="flex items-center justify-between">
                      <span>Here's your distilled content</span>
                      {getCharacterLimit() && (
                        <span className={`text-sm ${
                          getCharacterCount() > getCharacterLimit()! 
                            ? 'text-red-500' 
                            : 'text-gray-500'
                        }`}>
                          {getCharacterCount()}/{getCharacterLimit()} characters
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      {summary.split("\n").map((line, index) => (
                        <p key={index} className="mb-4 last:mb-0 text-gray-700 animate-in slide-in-from-right-1" style={{ animationDelay: `${index * 100}ms` }}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                {renderPreview()}
              </>
            ) : (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm bg-dot-pattern">
                <CardContent className="min-h-[300px] flex items-center justify-center text-gray-500">
                  {isLoading ? (
                    <div className="flex flex-col items-center space-y-4">
                      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                      <p>Processing your content...</p>
                    </div>
                  ) : (
                    "Your distilled content will appear here"
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <footer className="mt-16 text-center">
          <div className="inline-flex items-center space-x-1 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-full">
            <div className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse" />
            <p>Powered by advanced AI to extract what matters most</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
