# Pictogen

**AI Powered Pictogram Generator**

Pictogen is a modern web application that creates custom SVG icons using AI-powered image generation and advanced vector conversion. Built with Next.js, TypeScript, and OpenAI's API.

## Features

- 🤖 **AI-Powered Generation**: Uses OpenAI's image generation API to create custom pictograms
- 🔄 **PNG to SVG Conversion**: Automatically converts generated images to scalable SVG format using Potrace
- 🎨 **Multiple Icon Styles**: Support for FontAwesome, Material, Feather, and other popular icon styles
- 📜 **History Management**: Automatically saves and displays your generated icons
- ⬬ **Multiple Export Sizes**: Download icons in various sizes (16px, 24px, 32px, 48px, 64px)
- 📋 **Copy to Clipboard**: Easily copy SVG code for direct use

## Built With

- **Next.js 14** - React framework for production
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern, accessible UI components
- **OpenAI API** - AI-powered image generation
- **Potrace** - Bitmap to vector graphics converter
- **Sonner** - Toast notifications

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn
- OpenAI API key (required for AI generation)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd svg-icon-generator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your OpenAI API key:
```env
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. **Enter a Description**: Type what kind of icon you want in the textarea (e.g., "mail", "home", "settings")
2. **Choose Style**: Select from Auto, FontAwesome, Feather, or Material styles to influence the generation style
3. **Generate**: Click the "生成" button or press Ctrl + Enter
4. **Preview**: View your generated icon on different background colors
5. **Download**: Export your icon in various sizes (16px to 64px) or copy the SVG code

## How It Works

1. **AI Generation**: Your text prompt is sent to OpenAI's image generation API with style specifications
2. **Vector Conversion**: The generated PNG image is automatically converted to SVG using Potrace
3. **Optimization**: The SVG is cleaned and optimized for web use
4. **Error Handling**: Clear error messages are displayed if generation fails

## Test Pages

- `/openai-test` - Test OpenAI image generation directly
- `/png-to-svg-test` - Test PNG to SVG conversion functionality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons inspired by [Lucide](https://lucide.dev/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Built with [Next.js](https://nextjs.org/)

## Environment Variables

- `NEXT_PUBLIC_OPENAI_API_KEY` - Your OpenAI API key (required for AI generation)

## Architecture

- **Frontend**: Next.js App Router with React Server Components
- **API Routes**: 
  - `/api/generate-icon` - Main icon generation endpoint
  - `/api/openai-generate` - Direct OpenAI image generation
  - `/api/trace-image` - PNG to SVG conversion using Potrace
- **State Management**: React hooks with local storage for history
- **Styling**: Tailwind CSS with CSS variables for theming

---

**Pictogen** - Create beautiful SVG icons with AI-powered generation