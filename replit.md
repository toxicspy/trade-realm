# The Trading Realm

## Overview

The Trading Realm is a dark-themed, royal/fantasy-styled trading information website that presents global market data in an immersive, cinematic experience. Users are welcomed as "royalty" entering a trading universe, with access to market indices, news, and cryptocurrency prices across USA, India, Japan, and Crypto markets. The application features interactive Bull/Bear mode switching for viewing gaining vs losing markets, date-based historical data viewing, and a command dashboard layout for detailed market analysis.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side navigation with routes for home (`/`) and market pages (`/market/:region`)
- **State Management**: TanStack React Query for server state, local React state for UI state
- **Styling**: Tailwind CSS with shadcn/ui component library (new-york style), CSS variables for theming
- **Animations**: Framer Motion for cinematic transitions and interactive effects
- **Charts**: Recharts for market performance visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Development**: Vite dev server with HMR, tsx for TypeScript execution

### Data Layer
- **Database**: PostgreSQL with three main tables:
  - `market_news`: Region-specific news with sentiment analysis
  - `market_indices`: Market index values and changes by region
  - `crypto_prices`: Cryptocurrency price data
- **Schema Location**: `shared/schema.ts` with Drizzle-Zod integration for type-safe validation

### Build System
- **Client Build**: Vite bundles React app to `dist/public`
- **Server Build**: esbuild compiles server to `dist/index.cjs` with selective dependency bundling
- **Database Migrations**: `drizzle-kit push` for schema synchronization

### Key Design Patterns
- **Shared Types**: Schema and route definitions in `shared/` folder used by both client and server
- **Component Structure**: UI primitives from shadcn/ui in `components/ui/`, feature components at `components/` root
- **Custom Hooks**: Data fetching hooks in `hooks/use-market-data.ts` wrap React Query calls
- **Path Aliases**: `@/` for client source, `@shared/` for shared code

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage for Express sessions

### UI Component Libraries
- **Radix UI**: Headless component primitives (dialogs, dropdowns, tooltips, etc.)
- **shadcn/ui**: Pre-styled component collection built on Radix
- **Lucide React**: Icon library

### Data & Validation
- **Zod**: Runtime type validation for API contracts
- **drizzle-zod**: Automatic Zod schema generation from Drizzle tables

### Visualization
- **Recharts**: React charting library for market graphs
- **Embla Carousel**: Carousel component foundation

### Date Handling
- **date-fns**: Date manipulation and formatting
- **react-day-picker**: Calendar component for date selection

### Development Tools
- **Vite**: Frontend bundler with React plugin
- **@replit/vite-plugin-***: Replit-specific development enhancements