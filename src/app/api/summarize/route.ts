import { NextResponse } from "next/server"
import OpenAI from "openai"
import { YoutubeTranscript } from 'youtube-transcript'

export const runtime = 'nodejs'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Output format configurations with specialized prompts
const OUTPUT_FORMATS = {
  summary: {
    system: `You are an expert content summarizer. Your task is to create clear, engaging summaries that capture the essence of the content.

Instructions:
- Create a coherent narrative summary
- Focus on the main ideas and key supporting details
- Maintain the original tone and context
- Use clear, accessible language
- Keep paragraphs short and focused
- Include relevant statistics or data points
- Preserve key quotes if important

Remember: The summary should be comprehensive yet concise, allowing readers to understand the full scope of the content quickly.`,
    maxTokens: 500,
    temperature: 0.7
  },
  bullets: {
    system: `You are a precision content analyzer. Your task is to extract and organize the key points in a clear, hierarchical structure.

Instructions:
- Start each main point with "•" and sub-points with "-"
- Present points in logical order
- Keep each point concise and self-contained
- Include specific details and data
- Group related points together
- Use consistent formatting
- Maximum 3 levels of hierarchy

Format example:
• Main point one
  - Supporting detail
  - Additional context
• Main point two
  - Supporting detail

Remember: Each point should provide value on its own while contributing to the overall understanding.`,
    maxTokens: 400,
    temperature: 0.5
  },
  takeaways: {
    system: `You are an insights specialist. Your task is to identify and articulate the most valuable learnings and actionable insights from the content.

Instructions:
- Start each takeaway with "💡"
- Focus on practical, actionable insights
- Highlight unexpected or counter-intuitive findings
- Include relevant context when needed
- Prioritize insights by importance
- Make each takeaway meaningful and standalone
- Maximum 5-7 key takeaways

Format example:
💡 Key insight one: [explanation]
💡 Key insight two: [explanation]

Remember: Focus on insights that provide value and can be applied or understood immediately.`,
    maxTokens: 350,
    temperature: 0.6
  },
  tweet: {
    system: `You are a social media expert. Your task is to create a compelling, informative tweet that captures the essence of the content in 280 characters.

Instructions:
- Maximum 280 characters
- Capture the most important point
- Use engaging, clear language
- Include numbers or stats if relevant
- Make it quotable and shareable
- Avoid hashtags unless crucial
- Use emojis sparingly and meaningfully

Remember: The tweet should stand alone while encouraging readers to learn more.`,
    maxTokens: 60,
    temperature: 0.8
  },
  thread: {
    system: `You are a Twitter thread composer. Your task is to break down complex content into an engaging, informative thread.

Instructions:
- Create 4-6 connected tweets
- Maximum 280 characters per tweet
- Number each tweet (1/x format)
- Start with a hook
- Each tweet should flow naturally to the next
- Make each tweet valuable on its own
- End with a strong conclusion
- Use emojis strategically

Format example:
1/5 Opening hook and context
2/5 First main point
[continue format]
5/5 Conclusion and call to action

Remember: The thread should tell a coherent story while making complex information accessible.`,
    maxTokens: 400,
    temperature: 0.7
  }
}

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
    throw new Error('Failed to fetch YouTube transcript. Please check if the video has closed captions enabled.')
  }
}

async function fetchWebContent(url: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.statusText}`)
    }
    const text = await response.text()
    
    // Enhanced HTML to text conversion
    const cleanText = text
      // Remove scripts and styles
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      // Remove comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Replace common block elements with newlines
      .replace(/<(p|div|br|h[1-6])[^>]*>/gi, '\n')
      // Remove all other HTML tags
      .replace(/<[^>]+>/g, ' ')
      // Fix spacing
      .replace(/\s+/g, ' ')
      .trim()
    
    if (!cleanText) {
      throw new Error('No readable content found on the webpage')
    }
    
    return cleanText
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch web content. Please check the URL and try again.')
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
    const { content, contentType, outputFormat } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: "Please provide content to process" },
        { status: 400 }
      )
    }

    if (!outputFormat || !OUTPUT_FORMATS[outputFormat as keyof typeof OUTPUT_FORMATS]) {
      return NextResponse.json(
        { error: "Please select a valid output format" },
        { status: 400 }
      )
    }

    let textToProcess = content

    // Handle URLs
    if (await isValidUrl(content)) {
      const videoId = await getYoutubeVideoId(content)
      
      if (videoId) {
        // Handle YouTube video
        textToProcess = await fetchYoutubeTranscript(videoId)
      } else {
        // Handle regular web page
        textToProcess = await fetchWebContent(content)
      }
    }

    // Truncate very long content to avoid token limits
    if (textToProcess.length > 15000) {
      textToProcess = textToProcess.slice(0, 15000) + '...'
    }

    const formatConfig = OUTPUT_FORMATS[outputFormat as keyof typeof OUTPUT_FORMATS]

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: formatConfig.system
        },
        {
          role: "user",
          content: textToProcess
        }
      ],
      temperature: formatConfig.temperature,
      max_tokens: formatConfig.maxTokens,
    })

    const processedContent = completion.choices[0].message.content

    return NextResponse.json({ 
      summary: processedContent,
      format: outputFormat,
      contentLength: textToProcess.length
    })
  } catch (error) {
    console.error("Processing error:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : "Failed to process content. Please try again."
      },
      { status: 500 }
    )
  }
} 