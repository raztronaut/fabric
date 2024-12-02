# Distill

Transform lengthy content into clear, actionable insights. Distill uses advanced AI to extract what matters most from articles, videos, and documents.

## Features

- **Smart Content Processing**: Automatically handles web articles, YouTube videos, and direct text
- **AI-Powered Analysis**: Leverages GPT-4 for intelligent content understanding
- **Clean Interface**: Modern, responsive design with intuitive controls
- **Instant Results**: Get key insights in seconds
- **Universal Support**: Works with any text content, web articles, or YouTube videos

## Technology

- Next.js 14 with App Router
- TypeScript for reliability
- Tailwind CSS for styling
- Shadcn UI components
- OpenAI GPT-4 API
- YouTube transcript extraction

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd distill
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment:
   - Create a `.env.local` file
   - Add your OpenAI API key:

```
OPENAI_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## Deployment

Deploy on Vercel for the best experience:

1. Push your code to GitHub
2. Import your repository at [vercel.com/new](https://vercel.com/new)
3. Add your `OPENAI_API_KEY` in the environment variables
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
