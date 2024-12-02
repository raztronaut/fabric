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
  },
  linkedin: {
    system: `You are a LinkedIn content strategist. Your task is to create a professional, engaging post that drives meaningful engagement.

Instructions:
- Start with a powerful hook (question, statistic, or challenge)
- Structure the post in 3-4 short, scannable paragraphs
- Use LinkedIn-style formatting:
  • Add line breaks between paragraphs
  • Use emojis strategically (max 2-3)
  • Include bullet points for key takeaways
- Maintain a professional yet conversational tone
- Include one relevant data point or statistic
- End with either:
  • A thought-provoking question
  • A clear call-to-action
  • An invitation for discussion
- Add 3 relevant hashtags at the end
- Keep under 1,300 characters
- Format for mobile readability

Example structure:
[Attention-grabbing hook]

[Context and main insight]

[Key takeaways or practical application]

[Engaging question or call-to-action]

#[industry] #[topic] #[trend]

Remember: Focus on providing professional value while encouraging meaningful discussion. Write in a first-person perspective to make it more authentic.`,
    maxTokens: 350,
    temperature: 0.7
  }
}

// Add hashtag categories
const HASHTAG_CATEGORIES = {
  technology: ['tech', 'innovation', 'digital', 'future', 'ai', 'machinelearning', 'data', 'programming'],
  business: ['business', 'entrepreneurship', 'leadership', 'management', 'startup', 'success', 'growth'],
  career: ['career', 'jobs', 'hiring', 'work', 'productivity', 'personaldevelopment', 'networking'],
  marketing: ['marketing', 'socialmedia', 'branding', 'digitalmarketing', 'content', 'strategy'],
  industry: ['fintech', 'healthtech', 'edtech', 'sustainability', 'blockchain', 'cybersecurity']
} as const

async function suggestHashtags(content: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a LinkedIn hashtag expert. Analyze the content and suggest 3 relevant hashtags from these categories:
${Object.entries(HASHTAG_CATEGORIES).map(([category, tags]) => 
  `${category}: ${tags.map(tag => '#' + tag).join(', ')}`
).join('\n')}

Return only the hashtags, separated by spaces, no other text.`
        },
        {
          role: "user",
          content
        }
      ],
      temperature: 0.3,
      max_tokens: 50,
    })

    return completion.choices[0].message.content?.trim() || ''
  } catch (error) {
    console.error('Error suggesting hashtags:', error)
    return ''
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

    if (!contentType || !['url', 'youtube', 'text'].includes(contentType)) {
      return NextResponse.json(
        { error: "Please select a valid content type" },
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

    // Process content based on type
    if (contentType === 'url' || contentType === 'youtube') {
      if (!await isValidUrl(content)) {
        return NextResponse.json(
          { error: "Please provide a valid URL" },
          { status: 400 }
        )
      }

      const videoId = await getYoutubeVideoId(content)
      
      if (contentType === 'youtube' && !videoId) {
        return NextResponse.json(
          { error: "Please provide a valid YouTube URL" },
          { status: 400 }
        )
      }
      
      if (videoId) {
        textToProcess = await fetchYoutubeTranscript(videoId)
      } else {
        textToProcess = await fetchWebContent(content)
      }
    }

    // Validate processed text
    if (!textToProcess.trim()) {
      return NextResponse.json(
        { error: "No content could be extracted. Please check your input and try again." },
        { status: 400 }
      )
    }

    // Truncate very long content to avoid token limits
    const maxLength = 15000
    if (textToProcess.length > maxLength) {
      textToProcess = textToProcess.slice(0, maxLength) + '...'
      console.log(`Content truncated from ${textToProcess.length} to ${maxLength} characters`)
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
      presence_penalty: 0.1, // Slightly encourage new topics
      frequency_penalty: 0.1, // Slightly discourage repetition
    })

    const processedContent = completion.choices[0].message.content

    if (!processedContent) {
      throw new Error("Failed to generate content. Please try again.")
    }

    // Get hashtag suggestions for LinkedIn posts
    let hashtags = ''
    if (outputFormat === 'linkedin') {
      hashtags = await suggestHashtags(textToProcess)
    }

    return NextResponse.json({ 
      summary: processedContent,
      format: outputFormat,
      contentLength: textToProcess.length,
      truncated: textToProcess.length > maxLength,
      hashtags: hashtags || undefined
    })
  } catch (error) {
    console.error("Processing error:", error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: "Server configuration error. Please try again later." },
          { status: 500 }
        )
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to process content. Please try again." },
      { status: 500 }
    )
  }
} 