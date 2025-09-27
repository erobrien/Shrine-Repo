# Peptide Dojo by Shrine Peptides

## Overview

Peptide Dojo is an educational companion site for Shrine Peptides that provides evidence-based peptide research and information. The platform transforms complex peptide science into a structured learning experience using a gamified "dojo" progression system. Users advance through belt levels (white → red → black → gold) while mastering peptide fundamentals, applications, and clinical protocols. The site serves as a trusted resource for researchers, clinicians, health professionals, and individuals seeking scientifically-backed peptide information.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**React + TypeScript SPA**: Modern single-page application built with React 18 and TypeScript for type safety and developer experience. Uses Vite as the build tool with hot module replacement for rapid development.

**Component Design System**: Based on shadcn/ui components with Radix UI primitives for accessibility. Implements a custom design system that extends Shrine Peptides' brand identity into educational contexts. All components are built with TypeScript interfaces for props validation and development tooling.

**Styling Strategy**: Tailwind CSS with custom CSS variables for brand colors and spacing. Implements a sophisticated color system supporting both light and dark themes. Uses the Inter font family throughout with specific weights for different UI elements (Bold for headlines, Medium for subheadings, Regular for body text, Light for captions).

**Routing**: Client-side routing with Wouter for lightweight navigation between pages. Supports deep linking and browser history management without the overhead of larger routing libraries.

**State Management**: TanStack Query (React Query) for server state management, caching, and API synchronization. Provides automatic background refetching, optimistic updates, and error handling for data fetching operations.

### Backend Architecture

**Express.js Server**: RESTful API server using Express with TypeScript. Configured with middleware for JSON parsing, CORS handling, and request logging. Supports both development and production environments with environment-specific configurations.

**Database Abstraction**: Uses Drizzle ORM for type-safe database operations with PostgreSQL. Schema definitions are shared between client and server for consistent typing. Supports migrations and schema evolution through Drizzle Kit.

**Storage Interface**: Implements a storage abstraction pattern with both in-memory and database implementations. Currently uses MemStorage for development with easy migration path to full database persistence. Interface supports CRUD operations for users and can be extended for additional entities.

### Data Storage Solutions

**PostgreSQL Database**: Primary data store using Neon serverless PostgreSQL for scalability and performance. Database connection pooling is handled through Neon's connection pooling features.

**Schema Design**: User-centric schema with extensible design for future content types (peptides, modules, progress tracking). Uses UUID primary keys for distributed system compatibility and security.

**ORM Integration**: Drizzle ORM provides type-safe database queries with zero-cost abstractions. Schema definitions generate TypeScript types automatically, ensuring database and application code stay synchronized.

### Authentication and Authorization

**Session-Based Architecture**: Prepared for session-based authentication using PostgreSQL session store (connect-pg-simple). Sessions are persisted in the database for scalability across server instances.

**User Management**: Basic user schema with username/password authentication. Extensible design allows for additional user properties, roles, and permissions as the platform grows.

### External Dependencies

**UI Component Library**: Radix UI primitives for accessible, unstyled components. Provides keyboard navigation, screen reader support, and ARIA compliance out of the box.

**Form Handling**: React Hook Form with Zod resolvers for type-safe form validation. Integrates with the component system for consistent error handling and user feedback.

**Development Tools**: Comprehensive TypeScript configuration with strict typing. ESBuild for production bundling, development server with HMR, and Replit-specific development plugins for enhanced DX.

**Database Services**: Neon serverless PostgreSQL for managed database hosting. Provides automatic scaling, connection pooling, and backup management without infrastructure overhead.

**Styling Dependencies**: Tailwind CSS for utility-first styling with custom theme extensions. PostCSS for CSS processing and autoprefixer for browser compatibility.

**Build and Deployment**: Vite build system optimized for modern browsers with code splitting and asset optimization. Supports both development and production builds with environment-specific configurations.