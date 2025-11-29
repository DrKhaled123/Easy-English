# Code Analyzer

AI-powered code analysis tool for error detection, best practices, and clean code suggestions.

## Features

- **Multi-language Support**: JavaScript, TypeScript, Python, HTML, CSS
- **AI-Powered Analysis**: Uses OpenAI GPT-4 or Claude for intelligent code review
- **Monaco Editor**: Professional code editor with syntax highlighting
- **Real-time Error Highlighting**: Visual markers for errors and warnings
- **One-Click Fixes**: Apply suggested fixes directly
- **Best Practices**: Industry-standard coding recommendations
- **Clean Code Suggestions**: Refactoring and readability improvements

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- OpenAI API key or Claude API key

### Installation

```bash
# Navigate to the code-analyzer directory
cd code-analyzer

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

### Configuration

1. Open the app in your browser (default: http://localhost:5173)
2. Click the Settings icon or navigate to /settings
3. Enter your OpenAI or Claude API key
4. Select your preferred AI provider

## Usage

1. **Write or paste code** in the Monaco editor
2. **Select the language** from the dropdown
3. **Click "Analyze"** to run AI-powered analysis
4. **Review results** in the Analysis Panel:
   - Errors: Critical issues that need fixing
   - Warnings: Potential problems
   - Best Practices: Industry recommendations
   - Clean Code: Refactoring suggestions
5. **Apply fixes** by clicking the "Apply fix" button

## Tech Stack

- **Framework**: SvelteKit 2.x
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Editor**: Monaco Editor
- **AI**: OpenAI GPT-4 / Claude 3
- **Deployment**: Vercel

## Project Structure

```
code-analyzer/
├── src/
│   ├── lib/
│   │   ├── components/     # UI components
│   │   │   ├── ui/         # Base UI components
│   │   │   ├── editor/     # Monaco editor components
│   │   │   ├── analysis/   # Analysis result components
│   │   │   └── settings/   # Settings components
│   │   ├── services/       # AI and analysis services
│   │   ├── stores/         # Svelte stores
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── routes/             # SvelteKit routes
│   └── app.css             # Global styles
├── static/                 # Static assets
└── package.json
```

## API Key Security

- API keys are stored in browser localStorage
- Keys are never sent to any server except the AI provider
- Keys are only used for direct API calls to OpenAI/Anthropic

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check

# Linting
npm run lint
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your repository to Vercel for automatic deployments.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.