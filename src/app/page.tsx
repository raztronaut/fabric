"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

type ContentType = 'url' | 'youtube' | 'text'
type OutputFormat = 'summary' | 'bullets' | 'takeaways' | 'tweet' | 'thread'

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
  }
}

export default function Home() {
  const [content, setContent] = useState("")
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [contentType, setContentType] = useState<ContentType>('url')
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('summary')

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Please enter content to distill")
      return
    }

    setIsLoading(true)
    setError("")
    setSummary("")

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
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
                      <p className="text-sm text-gray-600">Paste or type any text content</p>
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
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <p className="text-sm text-gray-600">
                    Ready to process
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
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Distilling...
                    </>
                  ) : (
                    "Distill Content"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:sticky lg:top-8">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-100 p-4 mb-8 animate-in slide-in-from-top-2">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {summary ? (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    {OUTPUT_FORMATS[outputFormat].icon} {OUTPUT_FORMATS[outputFormat].label}
                  </CardTitle>
                  <CardDescription>
                    Here's your distilled content
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
            ) : (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm bg-dot-pattern">
                <CardContent className="min-h-[300px] flex items-center justify-center text-gray-500">
                  Your distilled content will appear here
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
