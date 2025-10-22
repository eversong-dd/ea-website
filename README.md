# EA Website

High-performance, cinematic Next.js website hosted on Azure with advanced animations and video backgrounds.

## Tech Stack

- **Framework**: Next.js 15 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: 
  - Framer Motion (micro-interactions)
  - GSAP (cinematic hero sequences)
  - Lenis (smooth scrolling)
- **Infrastructure**: Azure Web App Service with CDN
- **Monitoring**: Application Insights

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deployment to Azure

This project uses Azure Developer CLI (azd) for deployment:

```bash
# Login to Azure
azd auth login

# Provision infrastructure and deploy
azd up
```

## Project Structure

```
ea-website/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── hero/             # Hero section with video
│   ├── animations/       # Animation utilities
│   └── ui/               # UI components
├── public/               # Static assets
│   └── videos/          # Optimized video loops
├── infra/               # Azure Bicep templates
│   ├── main.bicep
│   └── modules/
└── azure.yaml           # Azure deployment config
```

## Performance Optimizations

- Static generation where possible
- Optimized video delivery via Azure CDN
- Image optimization with AVIF/WebP
- React Compiler for optimized rendering
- Edge caching and compression

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## License

MIT
