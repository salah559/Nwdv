# Nova Dimensions - Web Development Agency Portfolio

## Overview

Nova Dimensions is a modern web development agency portfolio website featuring immersive 3D experiences. The application showcases demo projects with an emphasis on futuristic, cyberpunk-themed design. Built as a full-stack TypeScript application with React frontend and Express backend, it demonstrates capabilities in 3D web graphics, modern UI design, and responsive layouts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **Styling**: Tailwind CSS v4 with custom cyberpunk dark theme using CSS variables
- **UI Components**: shadcn/ui component library (New York style) built on Radix UI primitives
- **3D Graphics**: React Three Fiber with Three.js, using @react-three/drei for helpers
- **Animations**: Framer Motion for page transitions and micro-interactions
- **State Management**: TanStack React Query for server state
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: REST API with `/api` prefix for all routes
- **Static Serving**: Express static middleware serves built client assets
- **Development**: Vite dev server with HMR integration

### Data Storage
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Location**: `shared/schema.ts` with Zod validation via drizzle-zod
- **Current Storage**: In-memory storage (`MemStorage` class) as default implementation
- **Database Ready**: PostgreSQL configuration in place via `DATABASE_URL` environment variable

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/  # UI components (shadcn/ui + custom)
│   │   ├── pages/       # Route pages (home, projects, contact)
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and query client
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route registration
│   ├── storage.ts    # Data access layer
│   └── vite.ts       # Vite dev server integration
├── shared/           # Shared types and schema
│   └── schema.ts     # Drizzle schema definitions
└── migrations/       # Database migrations (drizzle-kit)
```

### Design Patterns
- **Path Aliases**: `@/*` for client source, `@shared/*` for shared code
- **Component Architecture**: Composition-based with Radix primitives
- **API Requests**: Centralized `apiRequest` helper with error handling
- **Theme System**: CSS custom properties for dark cyberpunk theme with neon accents

## External Dependencies

### Third-Party Services
- **Fonts**: Google Fonts (Orbitron, Inter, Rajdhani)
- **3D Models**: Local GLB files served from public directory

### Database
- **PostgreSQL**: Required for production (via `DATABASE_URL` environment variable)
- **Drizzle Kit**: For schema migrations (`npm run db:push`)

### Key NPM Packages
- **UI**: Radix UI primitives, Lucide icons, class-variance-authority
- **3D**: three.js, @react-three/fiber, @react-three/drei
- **Forms**: react-hook-form with @hookform/resolvers and zod
- **HTTP**: TanStack React Query for data fetching
- **Sessions**: connect-pg-simple for PostgreSQL session storage (when enabled)

### Replit Integration
- Custom Vite plugins for development banner and cartographer
- Meta images plugin for OpenGraph tags
- Runtime error overlay for debugging