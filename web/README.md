# Web Applications

This directory contains all web applications for the nelnel project, separated from IoT/hardware code.

## Structure

```
web/
├── site/          # Main Next.js application (Vercel deployment target)
├── lp/            # Legacy landing page (backup)
└── README.md      # This file
```

## Applications

### Main Site (`/web/site`)

The primary Next.js application featuring:

- **Root Route (`/`)**: Interactive Nel-chan timeline demo
  - Real-time activity tracking simulation
  - Interactive charts and data visualization
  - TypeScript + Framer Motion + Recharts + Lucide React
  
- **LP Route (`/lp`)**: Landing page for CatSense product
  - Cat behavior monitoring product showcase
  - Call-to-action for demo and monitoring program

**Tech Stack:**
- Next.js 15.3.2 with App Router
- TypeScript
- Tailwind CSS 4
- Framer Motion (animations)
- Recharts (data visualization)
- Lucide React (icons)

**Features:**
- Responsive design
- Real-time data simulation
- Interactive timeline
- Activity analytics
- Mood indicators
- Glass morphism UI effects

### Legacy LP (`/web/lp`)

Backup of the original landing page application.

## Development

### Main Site
```bash
cd web/site
npm install
npm run dev
```

### Legacy LP
```bash
cd web/lp
npm install
npm run dev
```

## Deployment

The main site (`/web/site`) is configured for Vercel deployment:
- Build command: `npm run build`
- Output directory: `.next`
- Node.js version: 18+

## Environment

- All applications use modern web standards
- Optimized for performance and SEO
- Mobile-first responsive design
- Dark/light mode support