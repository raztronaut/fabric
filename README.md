# Fabric Summarizer

A web application that uses Fabric's summarization pattern to create concise versions of articles, documents, and YouTube videos.

## Features

- Summarize articles and documents by pasting content
- Support for YouTube video transcripts
- Support for web article URLs
- Clean and modern UI using Tailwind CSS
- Powered by OpenAI's GPT-4 model
- Responsive design for all devices

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd fabric
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:

```
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment on Vercel

The easiest way to deploy this application is to use the Vercel Platform.

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your project to Vercel:
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Choose your Git repository
   - Click "Import"

3. Configure the project:
   - Add your environment variables:
     - `OPENAI_API_KEY`: Your OpenAI API key
   - Click "Deploy"

4. Your application will be deployed to a URL like: `https://your-project.vercel.app`

## Environment Variables

The following environment variables are required:

- `OPENAI_API_KEY`: Your OpenAI API key for the summarization functionality

## Technology Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- OpenAI API

## License

MIT
