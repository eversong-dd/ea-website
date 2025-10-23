# Branching Strategy & Deployment

This repository uses a Git Flow-inspired branching strategy with automated CI/CD pipelines.

**Important**: All deployments happen automatically via GitHub Actions based on which branch you push to. You should never need to manually switch Azure environments locally.

## Branch Structure

### `develop` → Test Environment
- **Purpose**: Integration branch for ongoing development
- **Deployment**: Automatically deploys to Azure test environment on every push via GitHub Actions
- **Azure Environment**: `test` 
- **Resource Group**: `rg-website-test`
- **URL**: https://app-rixoirdj4a3x6.azurewebsites.net
- **Testing**: All feature work is merged here first for integration testing
- **Local Work**: This is your default branch for development

### `main` → Production Environment  
- **Purpose**: Stable production-ready code
- **Deployment**: Automatically deploys to Azure production environment on every push/merge via GitHub Actions
- **Azure Environment**: `prod`
- **Resource Group**: `rg-website-prod`
- **URL**: https://app-p3ekdbppge5hk.azurewebsites.net
- **Updates**: Only receives code via PR/merge from `develop` branch
- **Local Work**: You typically don't work on this branch directly

### `feature/*` branches
- **Purpose**: Individual feature development
- **Deployment**: No automatic deployments - test locally only
- **Testing**: Test locally using `npm run dev` and `npm run build`
- **Workflow**: Create from `develop`, merge back to `develop` when complete
- **Naming**: Use descriptive names like `feature/hero-animation` or `feature/contact-form`

## Workflow

**Golden Rule**: Never commit directly to `develop` or `main`. Always work on feature branches.

### Starting new work
```bash
# Switch to develop and make sure it's up to date
git checkout develop
git pull origin develop

# Create feature branch with descriptive name
git checkout -b feature/your-feature-name
# Examples: feature/hero-section, feature/contact-form, feature/performance-optimization

# Work on your feature...
# Test locally with: npm run dev
# Build locally with: npm run build
```

### Testing your feature locally
```bash
# Run development server (with hot reload)
npm run dev
# Visit http://localhost:3000

# Test production build locally
npm run build
npm start
# Visit http://localhost:3000
```

### Deploying to test environment
```bash
# Commit your changes on the feature branch
git add .
git commit -m "feat: your feature description"

# Push feature branch to GitHub (optional, for backup or collaboration)
git push origin feature/your-feature-name

# Switch to develop and merge your feature
git checkout develop
git pull origin develop  # Make sure develop is up to date
git merge feature/your-feature-name

# Push to develop - this triggers automatic deployment to TEST
git push origin develop
# ✅ GitHub Actions automatically deploys to https://app-rixoirdj4a3x6.azurewebsites.net

# Wait a few minutes and test your changes on the test site
```

### Promoting to production
```bash
# After testing thoroughly on test environment:

# Switch to main and merge develop
git checkout main
git pull origin main
git merge develop

# Push to main - this triggers automatic deployment to PRODUCTION
git push origin main
# ✅ GitHub Actions automatically deploys to https://app-p3ekdbppge5hk.azurewebsites.net

# Optional: Create a GitHub release tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## GitHub Actions Variables

The workflow automatically selects the correct Azure environment based on the branch. These repository variables are configured in GitHub Settings → Secrets and variables → Actions → Variables:

- `AZURE_CLIENT_ID`: Service principal client ID (shared across environments)
- `AZURE_TENANT_ID`: Azure AD tenant ID (shared across environments)
- `AZURE_SUBSCRIPTION_ID`: Azure subscription ID (shared across environments)
- `AZURE_ENV_NAME_TEST`: Name of test environment (`test`)
- `AZURE_ENV_NAME_PROD`: Name of production environment (`prod`)
- `AZURE_LOCATION`: Azure region (e.g., `switzerlandnorth`)

**You don't need to change these** - they're already configured and working.

## Local Azure Environment (Advanced - Rarely Needed)

Your local `azd` environment should always be set to `test`. You almost never need to switch this.

```bash
# Check current environment
azd env list

# If needed, switch to test (should already be default)
azd env select test
```

**When would you use local azd commands?**
- 🚫 **Almost never** - GitHub Actions handles all deployments
- ✅ **Only if** you need to manually test infrastructure changes before pushing
- ✅ **Only if** you need to debug deployment issues locally

**Normal workflow**: Just push to branches, let GitHub Actions do the deployment.

## Branch Protection Rules (Recommended)

Configure in GitHub Settings → Branches:

### `main` branch
- ✅ Require pull request before merging
- ✅ Require approvals (at least 1)
- ✅ Require status checks to pass
- ✅ Do not allow bypassing

### `develop` branch  
- ✅ Require pull request before merging (optional)
- ✅ Require status checks to pass

## Local Development

**This is where you spend 99% of your time.** No deployments happen on feature branches - test everything locally first:

```bash
# Install dependencies (first time only, or after package.json changes)
npm install

# Run development server with hot reload
npm run dev
# Visit http://localhost:3000
# Changes auto-reload as you edit files

# Test production build locally (before pushing to develop)
npm run build
npm start
# Visit http://localhost:3000

# Lint your code
npm run lint
```

**Development workflow**:
1. Create feature branch
2. Make changes and test with `npm run dev`
3. Build locally to verify: `npm run build`
4. If build succeeds, commit and merge to `develop`
5. GitHub Actions deploys to test environment
6. Test on https://app-rixoirdj4a3x6.azurewebsites.net
7. If working, merge `develop` to `main` for production

## Environments Summary

| Environment | Branch | URL | Deploy Method | When to Use |
|------------|--------|-----|---------------|-------------|
| **Local Dev** | `feature/*` | http://localhost:3000 | `npm run dev` | Daily development & testing |
| **Test** | `develop` | https://app-rixoirdj4a3x6.azurewebsites.net | GitHub Actions | Integration testing |
| **Production** | `main` | https://app-p3ekdbppge5hk.azurewebsites.net | GitHub Actions | Live site |

## Troubleshooting

### Deployment failed on develop/main
1. Check GitHub Actions tab for error details
2. Review Azure App Service logs: `az webapp log tail --name <app-name> --resource-group <rg-name>`
3. Verify all GitHub variables are set correctly

### Want to skip deployment
Push to a feature branch instead of develop/main - feature branches don't trigger deployments.
