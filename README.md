# Pictogen

**AI Powered Pictogram Generator**

Pictogen is a modern web application that allows you to create custom SVG icons using simple text prompts. Powered by pattern matching and built with Next.js and TypeScript.

## Features

- 🎨 **Text-to-Icon Generation**: Create SVG icons from simple text descriptions
- 🌓 **Dark/Light Mode**: Seamless theme switching
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 📜 **History Management**: Keep track of your generated icons
- ⬬ **Multiple Export Formats**: Download icons in various sizes (16px to 64px)
- 🎯 **Pattern Matching**: Built-in library of common icon patterns
- ⌨️ **Keyboard Shortcuts**: Ctrl + Enter for quick generation

## Built With

- **Next.js 14** - React framework for production
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern, accessible UI components
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pictogen
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. **Enter a Description**: Type what kind of icon you want in the textarea (e.g., "mail", "home", "settings")
2. **Choose Style**: Select from Auto, FontAwesome, Feather, or Material styles
3. **Generate**: Click the "生成" button or press Ctrl + Enter
4. **Download**: Export your icon in various sizes or copy the SVG code

## Icon Patterns

Pictogen includes built-in patterns for common icons:
- Communication: mail, message, phone
- Navigation: home, menu, search, arrows
- Actions: download, upload, edit, delete
- UI Elements: settings, user, heart, star
- Status: check, close, alert, info

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

---

**Pictogen v0.1.0** - Create beautiful icons with AI-powered generation