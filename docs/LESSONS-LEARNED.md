# Lessons Learned: Azure Deployment & Infrastructure Setup

> **Purpose**: Document all the iterative fixes, gotchas, and solutions encountered during the initial deployment and infrastructure setup of this Next.js 16 application on Azure. Use this as a reference to avoid repeating mistakes.

---

## 📋 Table of Contents
1. [Next.js Build & Deployment Issues](#nextjs-build--deployment-issues)
2. [Azure App Service Configuration](#azure-app-service-configuration)
3. [CI/CD & Authentication](#cicd--authentication)
4. [Infrastructure as Code (Bicep)](#infrastructure-as-code-bicep)
5. [Azure Front Door & Custom Domains](#azure-front-door--custom-domains)
6. [Cost Optimization](#cost-optimization)
7. [Git & Repository Management](#git--repository-management)

---

## 🚨 Next.js Build & Deployment Issues

### Issue 1: Build Dependencies in Wrong Section
**Problem**: Container crashed with `Cannot find module '@tailwindcss/postcss'` during Azure build phase.

**Root Cause**: Azure Oryx runs `npm install --production` **before** the build phase, which only installs packages from `dependencies`, not `devDependencies`. Build-time packages were in `devDependencies`.

**Solution**: Move all build-time dependencies to `dependencies` section in `package.json`:
```json
{
  "dependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "tailwindcss": "^4.0.16",
    "babel-plugin-react-compiler": "^0.0.0"
  }
}
```

**Lesson**: 
- ✅ **Always put build-time dependencies in `dependencies` for Azure App Service**
- ✅ Azure Oryx workflow: `npm install --production` → `npm run build` → start app
- ❌ Don't assume `devDependencies` will be available during build

---

### Issue 2: Wrong Server Entry Point
**Problem**: Container crashed with `Cannot find module '/home/site/wwwroot/server.js'`

**Root Cause**: Default startup command was `node server.js`, but Next.js 16 doesn't use a `server.js` file. The correct command is `npm start`.

**Solution**: 
1. Set `appCommandLine: 'npm start'` in Bicep
2. Update via Azure Portal: Configuration → General settings → Startup Command
3. Restart the App Service

**Lesson**:
- ✅ **Next.js 16 requires `npm start`, not `node server.js`**
- ✅ Always verify startup command in both Bicep and Portal
- ❌ Don't use custom startup scripts unless absolutely necessary

---

### Issue 3: Wrong Port Configuration
**Problem**: App crashed because it was listening on port 3000, but Azure expects port 8080.

**Solution**: Add environment variable in Bicep:
```bicep
{
  name: 'PORT'
  value: '8080'
}
```

**Lesson**:
- ✅ **Azure App Service for Linux expects port 8080**
- ✅ Set `PORT` environment variable explicitly
- ❌ Don't rely on Next.js default port (3000)

---

## ⚙️ Azure App Service Configuration

### Issue 4: TypeScript Configuration Files Don't Deploy Well
**Problem**: Initially tried using `next.config.ts` (TypeScript), which caused deployment issues.

**Solution**: Use `next.config.js` (JavaScript) instead for Azure deployments.

**Lesson**:
- ✅ **Use `.js` config files for Azure deployments, not `.ts`**
- ✅ Keep configuration simple for production environments
- ❌ Avoid TypeScript config files in Azure App Service context

---

### Issue 5: Incorrect Always On Configuration for Basic Tier
**Problem**: Initial Bicep had `alwaysOn: true` for all environments, but Basic tier doesn't support this feature.

**Solution**: Conditional configuration based on tier:
```bicep
var isTestEnvironment = environmentName == 'test'
properties: {
  siteConfig: {
    alwaysOn: isTestEnvironment ? false : true  // Basic doesn't support alwaysOn
  }
}
```

**Lesson**:
- ✅ **Basic tier (B1) doesn't support Always On**
- ✅ Use conditional logic for tier-specific features
- ❌ Don't assume all features work across all tiers

---

## 🔐 CI/CD & Authentication

### Issue 6: Federated Credentials Not Created for Branches
**Problem**: GitHub Actions failed with `No matching federated identity record found` when deploying from `develop` branch.

**Root Cause**: Federated credentials were only created for `main` branch, not for `develop`.

**Solution**: Create federated credentials for each deploying branch:
```powershell
# For develop branch
az ad app federated-credential create `
  --id 75f00d9d-9339-4d8b-b39a-adeb734de21e `
  --parameters '{
    "name": "ea-website-develop",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:eversong-dd/ea-website:ref:refs/heads/develop",
    "audiences": ["api://AzureADTokenExchange"]
  }'

# For main branch
az ad app federated-credential create `
  --id 75f00d9d-9339-4d8b-b39a-adeb734de21e `
  --parameters '{
    "name": "ea-website-main",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:eversong-dd/ea-website:ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

**Lesson**:
- ✅ **Create federated credentials for EVERY branch that deploys**
- ✅ Use single service principal with multiple federated credentials
- ✅ Subject format: `repo:owner/repo:ref:refs/heads/{branch-name}`
- ❌ Don't assume credentials work across branches

---

### Issue 7: Old/Non-existent Service Principal
**Problem**: Initially tried using an old app registration that didn't exist or had wrong configuration.

**Solution**: 
1. Create new app registration: `ea-website-github-actions`
2. Create service principal from app registration
3. Assign Contributor role at subscription level
4. Create federated credentials for both branches

**Lesson**:
- ✅ **Always verify service principal exists and has correct permissions**
- ✅ Contributor role required for deployments
- ✅ Document the app registration ID for future reference
- ❌ Don't reuse old/outdated service principals

---

## 🏗️ Infrastructure as Code (Bicep)

### Issue 8: Infrastructure Drift Between Portal and Bicep
**Problem**: Manually changed App Service tiers in Azure Portal (from P1v3 to B1/P0v3 for cost savings), but Bicep still had old tiers. This created infrastructure-as-code drift.

**Solution**: Update Bicep to match Portal settings:
```bicep
var isTestEnvironment = environmentName == 'test'
sku: {
  name: isTestEnvironment ? 'B1' : 'P0v3'
  tier: isTestEnvironment ? 'Basic' : 'PremiumV3'
  capacity: 1
}
```

**Lesson**:
- ✅ **Always sync Bicep with manual Portal changes**
- ✅ Document why manual changes were made (usually cost optimization)
- ✅ Update Bicep immediately after manual changes
- ❌ Never leave infrastructure drift unresolved
- ❌ Don't make Portal changes without updating IaC

---

### Issue 9: GitHub Actions Only Deploys App, Not Infrastructure
**Problem**: Expected GitHub Actions to provision infrastructure changes, but it only runs `azd deploy` (app deployment).

**Solution**: 
- GitHub Actions: Only deploys application code (`azd deploy`)
- Infrastructure changes: Run `azd provision` locally

**Lesson**:
- ✅ **Understand the difference between `azd deploy` and `azd provision`**
- ✅ `azd deploy`: App code only (fast, runs on every push)
- ✅ `azd provision`: Infrastructure changes (slow, run manually)
- ✅ Update workflow if you want infrastructure auto-provisioning
- ❌ Don't expect infrastructure changes to deploy automatically

---

## 🌐 Azure Front Door & Custom Domains

### Issue 10: Front Door Route Domain Conflict
**Problem**: Initial Front Door deployment failed with error: `route domains, paths and protocols configuration has a conflict`

**Root Cause**: Both routes (test and prod) were trying to use the same default Front Door endpoint domain with `linkToDefaultDomain: 'Enabled'`.

**Solution**: Disable default domain linking on routes:
```bicep
properties: {
  linkToDefaultDomain: 'Disabled'  // Changed from 'Enabled'
  customDomains: [
    { id: customDomain.id }
  ]
}
```

**Lesson**:
- ✅ **Set `linkToDefaultDomain: 'Disabled'` when using custom domains**
- ✅ Each route must have unique domain/path/protocol combination
- ✅ Test with single route first, then add more
- ❌ Don't enable default domain if you have multiple routes with same paths

---

### Issue 11: DNS Validation Token Retrieval
**Problem**: Needed validation token for custom domain, but didn't know how to get it after deployment.

**Solution**: Use Azure CLI to retrieve token:
```powershell
az afd custom-domain show `
  --profile-name fd-p3ekdbppge5hk `
  --custom-domain-name test-eversong-ai `
  --resource-group rg-website-prod `
  --query "validationProperties.validationToken" `
  --output tsv
```

Or get it from Bicep output:
```bicep
output testDomainValidationToken string = frontDoor.outputs.testDomainValidationToken
```

**Lesson**:
- ✅ **Plan for validation token retrieval before deployment**
- ✅ Include tokens in Bicep outputs
- ✅ Document Azure CLI commands for manual retrieval
- ✅ Add tokens to DNS-SETUP.md documentation

---

### Issue 12: Custom Domain Name Format in Bicep
**Problem**: Tried using `test.eversong.ai` as custom domain resource name, but Bicep doesn't allow dots in resource names.

**Solution**: Replace dots with hyphens:
```bicep
resource customDomain 'Microsoft.Cdn/profiles/customDomains@2024-02-01' = {
  name: 'test-eversong-ai'  // Not 'test.eversong.ai'
  parent: profile
  properties: {
    hostName: 'test.eversong.ai'  // Actual domain here
  }
}
```

**Lesson**:
- ✅ **Resource names: use hyphens (test-eversong-ai)**
- ✅ **hostName property: use actual domain (test.eversong.ai)**
- ❌ Don't use dots in Azure resource names

---

## 💰 Cost Optimization

### Issue 13: Over-provisioned Initial Infrastructure
**Problem**: Initial deployment used Premium v3 P1v3 ($400/month) for both test and prod, which was way too expensive.

**Analysis**:
- Next.js 16 app is lightweight
- Test environment: Very low traffic
- Production: Moderate traffic expected

**Solution**:
- Test: Basic B1 (1 vCPU, 1.75GB RAM) - $13/month
- Prod: Premium P0v3 (1 vCPU, 4GB RAM) - $80/month
- Savings: $307/month (77% reduction)

**Lesson**:
- ✅ **Start small, scale up based on actual usage**
- ✅ Test environment doesn't need premium features
- ✅ Basic tier sufficient for low-traffic test environments
- ✅ Monitor performance before upgrading
- ❌ Don't over-provision "just in case"

---

### Issue 14: Front Door Cost vs. Benefits Decision
**Problem**: Adding Azure Front Door Standard ($35-55/month base) increased costs by ~35-50%.

**Decision**: Accepted cost increase for benefits:
- Global CDN performance
- Custom domain support with managed SSL
- DDoS protection
- Centralized routing
- Improved user experience

**Lesson**:
- ✅ **Evaluate cost vs. value, not just absolute cost**
- ✅ Custom domains + SSL worth the Front Door investment
- ✅ CDN performance benefits justify cost for public websites
- ✅ Document cost decisions for future reference

---

## 📝 Git & Repository Management

### Issue 15: .azure/.gitignore Configuration
**Problem**: After running `azd provision`, found uncommitted changes to `.azure/config.json` files with environment selection data.

**Root Cause**: Initial `.gitignore` allowed config files, but azd updates them frequently with local environment state.

**Solution**: Updated `.azure/.gitignore` to match azd defaults:
```gitignore
*
!.gitignore
```

**Lesson**:
- ✅ **Use azd default .gitignore (ignore everything in .azure/)**
- ✅ `.azure/` folder is for local state, not source control
- ✅ Restore unwanted config changes before committing
- ❌ Don't track azd environment selection in git

---

### Issue 16: Repository Cleanup Timing
**Problem**: Repository accumulated temporary files, unused scripts, and default assets over multiple iterations.

**Solution**: Dedicated cleanup phase after infrastructure stabilized:
- Created `docs/` folder for documentation
- Removed unused files (startup.sh, copy-standalone.js)
- Removed default Next.js assets (SVG files)
- Updated README with comprehensive information
- Organized documentation properly

**Lesson**:
- ✅ **Clean up repository after major milestones**
- ✅ Create proper folder structure early (docs/, scripts/, etc.)
- ✅ Remove default framework files you're not using
- ✅ Keep README current with live URLs and costs
- ❌ Don't let technical debt accumulate

---

## 🎯 Key Takeaways & Quick Reference

### Before Starting a New Azure Deployment:

1. **package.json**: Build dependencies in `dependencies`, not `devDependencies`
2. **Startup**: Use `npm start`, not `node server.js`
3. **Port**: Set `PORT=8080` environment variable
4. **Config files**: Use `.js` not `.ts` for production
5. **Service Principal**: Create new, don't reuse old ones
6. **Federated Credentials**: One per deploying branch
7. **App Service Tier**: Start small (B1 for test), scale based on usage
8. **Infrastructure**: Understand `azd deploy` vs `azd provision`
9. **Front Door**: Use `linkToDefaultDomain: 'Disabled'` with custom domains
10. **Git**: Ignore `.azure/*` except `.gitignore`

### Common Commands Reference:

```powershell
# Local testing
npm run build && npm start

# Deploy app only
azd deploy

# Deploy infrastructure
azd provision

# Switch environment
azd env select test
azd env select prod

# Get Front Door validation token
az afd custom-domain show --profile-name <name> --custom-domain-name <domain> --resource-group <rg> --query "validationProperties.validationToken" -o tsv

# Create federated credential
az ad app federated-credential create --id <app-id> --parameters '{...}'
```

### Documentation to Create:

- ✅ `README.md` - Overview, tech stack, costs, structure
- ✅ `docs/DEPLOYMENT.md` - Deployment workflow and procedures
- ✅ `docs/DNS-SETUP.md` - Custom domain configuration
- ✅ `docs/LESSONS-LEARNED.md` - This document!

---

## 📊 Success Metrics

**Before Optimization**:
- Cost: $400/month (2x Premium v3 P1v3)
- Deployment: Manual, error-prone
- Documentation: Minimal

**After Optimization**:
- Cost: $132-148/month (B1 + P0v3 + Front Door) - **63% reduction**
- Deployment: Automated CI/CD with branch-based deployment
- Documentation: Comprehensive (4 docs)
- Custom domains: Working with SSL
- Performance: Global CDN, optimized builds

---

## 🔄 Next Time Checklist

When starting a similar project, refer to this checklist:

- [ ] Build dependencies in `dependencies` section
- [ ] Startup command: `npm start`
- [ ] Port: `8080`
- [ ] Config files: `.js` format
- [ ] Create new service principal with documented ID
- [ ] Federated credentials for all deploying branches
- [ ] Start with small App Service tiers (B1 for test)
- [ ] Front Door: `linkToDefaultDomain: 'Disabled'`
- [ ] `.azure/*` in .gitignore
- [ ] Create `docs/` folder from the start
- [ ] Document all costs upfront
- [ ] Test locally before every push: `npm run build && npm start`
- [ ] Sync Bicep after any manual Portal changes
- [ ] Create comprehensive README early

---

**Last Updated**: October 23, 2025  
**Project**: ea-website (Next.js 16 on Azure)  
**Total Iterations to Success**: ~15-20 fixes across deployment, infrastructure, CI/CD, and DNS
