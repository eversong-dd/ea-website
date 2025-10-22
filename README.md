# EA Website - Azure Static Web App

High-performance, production-ready website hosted on Azure Static Web Apps. This is our primary touchpoint with prospects - performance and reliability are critical.

## 🏗️ Architecture

- **Hosting**: Azure Static Web Apps
- **Deployment**: GitHub Actions (CI/CD)
- **Infrastructure**: Bicep (Infrastructure as Code)
- **Local Development**: Live Server

## 📁 Project Structure

```
ea-website/
├── src/                        # Source files
│   ├── index.html             # Main HTML file
│   ├── css/                   # Stylesheets
│   │   └── style.css         # Main CSS (performance optimized)
│   ├── js/                    # JavaScript files
│   │   └── main.js           # Main JS (deferred loading)
│   └── images/                # Image assets
├── infra/                     # Infrastructure as Code
│   └── main.bicep            # Azure Bicep template
├── .github/
│   ├── workflows/
│   │   └── azure-static-web-apps.yml  # CI/CD pipeline
│   └── copilot-instructions.md        # Project guidelines
├── staticwebapp.config.json   # Azure SWA configuration
├── package.json               # Dependencies and scripts
└── .gitignore                 # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Azure CLI (for deployment)
- GitHub account (for CI/CD)

### Local Development

1. **Clone the repository**
   ```powershell
   git clone <your-repo-url>
   cd ea-website
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Start local development server**
   ```powershell
   npm run dev
   ```

   This will start a live server at `http://localhost:3000` with auto-reload on file changes.

4. **Test the website**
   - Open your browser to `http://localhost:3000`
   - Make changes to files in `src/`
   - Server will auto-reload on save

### Alternative Local Testing

You can also use VS Code's Live Server extension or any other static server:

```powershell
# Using Python
python -m http.server 3000 --directory src

# Using Node's http-server
npx http-server src -p 3000
```

## ☁️ Deployment to Azure

### Option 1: Automated Deployment (Recommended)

This project uses GitHub Actions for automated deployment.

1. **Create Azure Static Web App**
   ```powershell
   # Login to Azure
   az login

   # Create resource group
   az group create --name rg-ea-website --location eastus2

   # Deploy using Bicep
   az deployment group create `
     --resource-group rg-ea-website `
     --template-file infra/main.bicep `
     --parameters staticWebAppName=ea-website sku=Standard
   ```

2. **Get deployment token**
   ```powershell
   az staticwebapp secrets list `
     --name ea-website `
     --resource-group rg-ea-website `
     --query "properties.apiKey" -o tsv
   ```

3. **Configure GitHub Secret**
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add new secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Paste the deployment token from step 2

4. **Push to trigger deployment**
   ```powershell
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

### Option 2: Manual Deployment with Azure CLI

```powershell
# Preview deployment (recommended first)
az deployment group what-if `
  --resource-group rg-ea-website `
  --template-file infra/main.bicep `
  --parameters staticWebAppName=ea-website sku=Standard

# Deploy
az deployment group create `
  --resource-group rg-ea-website `
  --template-file infra/main.bicep `
  --parameters staticWebAppName=ea-website sku=Standard
```

## 🔄 CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/azure-static-web-apps.yml`) automatically:

- **On Push to `main`**: Builds and deploys to production
- **On Pull Request**: Creates preview environment for testing
- **On PR Close**: Cleans up preview environment

### Preview Deployments

Every pull request gets its own preview URL for testing before merging.

## ⚡ Performance Optimizations

This site is optimized for maximum performance:

- **Deferred JavaScript**: Non-critical JS loaded with `defer`
- **CSS Optimization**: Critical CSS inline, non-critical deferred
- **Lazy Loading**: Images load only when visible
- **Cache Headers**: Configured in `staticwebapp.config.json`
- **Minimal Dependencies**: Pure HTML/CSS/JS, no heavy frameworks
- **Responsive Design**: Mobile-first approach

## 🔒 Security Features

- **HTTPS Only**: Enforced in production
- **Security Headers**: CSP, X-Frame-Options, X-Content-Type-Options
- **No Hardcoded Secrets**: All sensitive data in Azure Key Vault
- **CORS Policies**: Configured in `staticwebapp.config.json`

## 🧪 Testing Checklist

Before deploying to production:

- [ ] Test all pages locally
- [ ] Verify responsive design (mobile, tablet, desktop)
- [ ] Check performance with Lighthouse (target: 90+ score)
- [ ] Validate all links work
- [ ] Test forms and interactive elements
- [ ] Check browser compatibility
- [ ] Review security headers
- [ ] Test on slow network connections

## 📊 Monitoring

After deployment, monitor your site:

```powershell
# View deployment logs
az staticwebapp show `
  --name ea-website `
  --resource-group rg-ea-website

# View metrics in Azure Portal
# https://portal.azure.com → Your Static Web App → Metrics
```

## 🛠️ Troubleshooting

### Local server not starting
```powershell
# Clear npm cache
npm cache clean --force
rm -r node_modules
npm install
```

### Deployment fails
- Check GitHub Actions logs in your repository
- Verify `AZURE_STATIC_WEB_APPS_API_TOKEN` secret is set
- Ensure Azure resource is created successfully

### Changes not reflecting
- Hard refresh browser (Ctrl+F5)
- Check if GitHub Action completed successfully
- Verify correct branch is deployed

## 📝 Development Guidelines

1. **Test locally first** - Always use `npm run dev` to test changes
2. **Performance matters** - Keep bundle sizes small, optimize images
3. **Security first** - Never commit secrets, use environment variables
4. **Mobile responsive** - Test on multiple screen sizes
5. **Browser compatibility** - Support modern browsers (last 2 versions)

## 🔗 Useful Links

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Bicep Documentation](https://docs.microsoft.com/azure/azure-resource-manager/bicep/)

## 📞 Support

For issues or questions, contact the development team.

---

**Last Updated**: October 22, 2025
