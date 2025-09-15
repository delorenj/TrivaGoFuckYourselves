# CRUSH.md

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (runs TypeScript check first)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Code Style
- TypeScript strict mode enabled with no unused locals/parameters
- Use React functional components with default exports
- Import statements use relative paths without file extensions
- Tailwind CSS for styling with brand color classes (brand-pale, brand-dark, brand-medium)
- Component names in PascalCase, file names match component names
- No explicit type annotations when TypeScript can infer types
- Use ESLint configuration with recommended TypeScript and React rules