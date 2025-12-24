# Trading Realm

A real-time global markets trading intelligence platform with mobile-optimized scrollable calendar and responsive design.

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: Shadcn UI + Radix UI
- **Forms**: React Hook Form + Zod validation
- **State Management**: TanStack React Query
- **Routing**: Wouter (lightweight router)

## Features

✨ **Global Mobile Calendar** - Scrollable, swipeable date picker on mobile devices  
📱 **Mobile-First Design** - Responsive across all devices  
📊 **Real-time Market Data** - Live market indices and news  
🌍 **Multi-Region Support** - USA, India, Japan, and Crypto markets  
🎨 **Dark Mode** - Full dark/light theme support  
📰 **News Feed** - Market intelligence and analysis

## Getting Started

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Start Production Server

```bash
npm start
```

## Deployment to Vercel

### Option 1: Connect Your Git Repository

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Vercel will automatically detect the framework and build settings
6. Click "Deploy"

### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from your project directory
vercel
```

### Environment Variables

Set these environment variables in your Vercel project settings:

```
NODE_ENV=production
```

### Configuration Files

- `vercel.json` - Vercel deployment configuration
- `Dockerfile` - Docker configuration for container deployments
- `.vercelignore` - Files to ignore during Vercel deployment

## Project Structure

```
├── client/              # React frontend
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Page components
│       ├── hooks/       # Custom React hooks
│       └── lib/         # Utilities and helpers
├── server/             # Express backend
│   ├── index.ts        # Server entry point
│   ├── routes.ts       # API routes
│   └── storage.ts      # Data storage interface
├── shared/             # Shared types and schemas
│   └── schema.ts       # Zod schemas and types
└── script/             # Build scripts
    └── build.ts        # Production build script
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run check` - Type check the project
- `npm run db:push` - Push database schema changes

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Mobile Features

### Scrollable Calendar

On mobile devices (<768px width), the date picker is automatically replaced with a modern scrollable calendar:

- **Swipe Left/Right** - Navigate between months
- **Swipe Down** - Close calendar
- **Touch-Friendly** - Large, tappable date items
- **Smooth Scrolling** - Velocity-based smooth scrolling
- **Today Button** - Quick jump to current date

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
