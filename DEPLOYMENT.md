# Branching Strategy & Deployment

This repository uses a Git Flow-inspired branching strategy with automated CI/CD pipelines.

## Branch Structure

### `develop` → Test Environment
- **Purpose**: Integration branch for ongoing development
- **Deployment**: Automatically deploys to Azure test environment on every push
- **Azure Environment**: `test` (existing resources: `rg-website-test`)
- **URL**: https://app-rixoirdj4a3x6.azurewebsites.net
- **Testing**: All feature work is merged here first for integration testing

### `main` → Production Environment  
- **Purpose**: Stable production-ready code
- **Deployment**: Automatically deploys to Azure production environment on every push/merge
- **Azure Environment**: `prod` (to be provisioned)
- **URL**: Will be configured after first production deployment
- **Updates**: Only receives code via PR from `develop` branch

### `feature/*` branches
- **Purpose**: Individual feature development
- **Deployment**: No automatic deployments
- **Testing**: Test locally using `npm run dev` and `npm run build`
- **Workflow**: Create from `develop`, merge back to `develop` when complete

## Workflow

### Starting new work
```bash
# Make sure develop is up to date
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Work on your feature...
# Test locally with: npm run dev
```

### Merging to test environment
```bash
# Commit your changes
git add .
git commit -m "feat: your feature description"

# Push to feature branch (optional)
git push origin feature/your-feature-name

# Merge to develop (triggers test deployment)
git checkout develop
git pull origin develop
git merge feature/your-feature-name
git push origin develop
# ✅ Automatic deployment to test environment triggered
```

### Promoting to production
```bash
# After testing in test environment, create PR from develop to main
# Or merge directly if you have permissions:
git checkout main
git pull origin main
git merge develop
git push origin main
# ✅ Automatic deployment to production environment triggered
```

## GitHub Actions Variables

The workflow uses these repository variables (configured in GitHub Settings → Secrets and variables → Actions → Variables):

- `AZURE_CLIENT_ID`: Service principal client ID
- `AZURE_TENANT_ID`: Azure AD tenant ID  
- `AZURE_SUBSCRIPTION_ID`: Azure subscription ID
- `AZURE_ENV_NAME_TEST`: Name of test environment (should be set to `test`)
- `AZURE_ENV_NAME_PROD`: Name of production environment (should be set to `prod`)
- `AZURE_LOCATION`: Azure region (e.g., `westeurope`)

## Setting Up Production Environment

To create the production environment for the first time:

```bash
# Checkout main branch
git checkout main

# Provision production infrastructure
azd env new prod
azd up --environment prod

# Note the production URL and update this README
```

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

No deployments happen on feature branches - test everything locally:

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
# Visit http://localhost:3000

# Test production build
npm run build
npm start
# Visit http://localhost:3000
```

## Troubleshooting

### Deployment failed on develop/main
1. Check GitHub Actions tab for error details
2. Review Azure App Service logs: `az webapp log tail --name <app-name> --resource-group <rg-name>`
3. Verify all GitHub variables are set correctly

### Want to skip deployment
Push to a feature branch instead of develop/main - feature branches don't trigger deployments.
