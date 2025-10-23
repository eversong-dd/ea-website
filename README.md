# EA Website

High-performance, cinematic Next.js website hosted on Azure with advanced animations and video backgrounds.

## 🚀 Live Environments

- **Production**: [www.eversong.ai](https://www.eversong.ai) (coming soon)
- **Test**: [test.eversong.ai](https://test.eversong.ai) ✅

## 🛠️ Tech Stack

- **Framework**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: 
  - Framer Motion (micro-interactions)
  - GSAP (cinematic hero sequences)
  - Lenis (smooth scrolling)
  - Locomotive Scroll
- **Infrastructure**: 
  - Azure App Service (hosting)
  - Azure Front Door (CDN + custom domains)
  - Azure Storage (video assets)
  - Application Insights (monitoring)
- **CI/CD**: GitHub Actions with branch-based deployment

## 📁 Project Structure

```
ea-website/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with animations
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── hero/             # Hero section with video background
│   └── animations/       # Reusable animation components
├── public/               # Static assets
│   └── videos/          # Optimized video loops
├── infra/               # Azure infrastructure (Bicep)
│   ├── main.bicep       # Main template
│   └── modules/         # Modular Bicep templates
│       ├── web-app.bicep      # App Service
│       ├── front-door.bicep   # CDN & custom domains
│       ├── storage.bicep      # Storage account
│       └── monitoring.bicep   # App Insights
├── docs/                # Documentation
│   ├── DEPLOYMENT.md    # Deployment workflow
│   └── DNS-SETUP.md     # Custom domain configuration
├── .github/workflows/   # CI/CD pipelines
└── azure.yaml          # Azure Developer CLI config
```

## 🏃 Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- Azure Developer CLI (for deployment)

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🚢 Deployment

This project uses Azure Developer CLI (azd) with branch-based deployment:

- **develop** branch → deploys to test environment
- **main** branch → deploys to production environment

GitHub Actions automatically deploys on push. For manual deployment or infrastructure changes:

```bash
# Login to Azure
azd auth login

# Select environment
azd env select prod  # or 'test'

# Deploy infrastructure (manual, when needed)
azd provision

# Deploy application only
azd deploy
```

**Documentation:**
- [Deployment Workflow](docs/DEPLOYMENT.md)
- [DNS Setup Guide](docs/DNS-SETUP.md)

## 💰 Infrastructure Costs

Current monthly costs (estimated):

- Test App Service (B1): $13/month
- Prod App Service (P0v3): $80/month
- Azure Front Door (Standard): ~$39-55/month
- Storage + Monitoring: ~$5/month
- **Total: ~$137-152/month**

## ⚡ Performance Optimizations

- React 19 with experimental React Compiler
- Turbopack (Next.js 16)
- Static generation where possible
- Optimized video delivery via Azure CDN
- AVIF/WebP image optimization
- Edge caching and compression
- Smooth scroll animations with hardware acceleration

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Azure App Service](https://learn.microsoft.com/azure/app-service/)
- [Azure Front Door](https://learn.microsoft.com/azure/frontdoor/)
- [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/)

## 📄 License

MIT
