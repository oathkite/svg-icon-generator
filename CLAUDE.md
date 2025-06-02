# Project Guidelines for Claude

## UI Component Standards

### Always Use shadcn/ui
- **ALL UI components must use shadcn/ui components**
- Do not create custom UI components from scratch
- Always check if a shadcn/ui component exists before implementing custom solutions
- Use the shadcn/ui CLI to add components: `npx shadcn@latest add [component-name]`

### Available shadcn/ui Components
- Form elements: Button, Input, Select, Checkbox, Radio, etc.
- Layout: Card, Dialog, Sheet, Tabs, etc.
- Data display: Table, Badge, Avatar, etc.
- Feedback: Alert, Toast, Progress, etc.
- Navigation: Navigation Menu, Dropdown Menu, etc.

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow the semantic color system (e.g., `bg-background`, `text-foreground`, `border-border`)
- Maintain consistency with the existing dark mode implementation
- Use CSS variables defined in `globals.css`

### Component Import Pattern
```typescript
import { ComponentName } from "@/components/ui/component-name"
```

## Development Commands
- Start development server: `npm run dev`
- Build for production: `npm run build`
- Run linter: `npm run lint`

## Testing
Please provide the testing commands if available, so Claude can run tests after making changes.