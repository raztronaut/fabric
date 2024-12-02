import { NextResponse } from "next/server"
import OpenAI from "openai"
import { YoutubeTranscript } from 'youtube-transcript'
import { JSDOM } from 'jsdom'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function getYoutubeVideoId(url: string) {
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v')
    } else if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1)
    }
    return null
  } catch {
    return null
  }
}

async function fetchYoutubeTranscript(videoId: string) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId)
    return transcript.map(item => item.text).join(' ')
  } catch {
    throw new Error('Failed to fetch YouTube transcript')
  }
}

async function fetchWebContent(url: string) {
  try {
    const response = await fetch(url)
    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document
    
    // Remove script and style elements
    document.querySelectorAll('script, style').forEach(el => el.remove())
    
    // Get main content (prioritize article or main content)
    const article = document.querySelector('article') || 
                   document.querySelector('main') || 
                   document.querySelector('.content') ||
                   document.querySelector('.article') ||
                   document.body
    
    return article.textContent.trim().replace(/\s+/g, ' ')
  } catch {
    throw new Error('Failed to fetch web content')
  }
}

async function isValidUrl(str: string) {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    let textToSummarize = content

    // Check if content is a URL
    if (await isValidUrl(content)) {
      const videoId = await getYoutubeVideoId(content)
      
      if (videoId) {
        // Handle YouTube video
        textToSummarize = await fetchYoutubeTranscript(videoId)
      } else {
        // Handle regular web page
        textToSummarize = await fetchWebContent(content)
      }
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a highly skilled summarizer. Create a concise, clear summary of the provided content while maintaining the key points and important details. Use bullet points for clarity when appropriate."
        },
        {
          role: "user",
          content: textToSummarize
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const summary = completion.choices[0].message.content

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Summarization error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate summary" },
      { status: 500 }
    )
  }
} 