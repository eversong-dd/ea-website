# EA Website - Azure Static Web App

This is a high-performance, Azure-hosted website serving as our primary touchpoint with prospects.

## Project Type
Azure Static Web App with modern HTML/CSS/JavaScript

## Development Guidelines
- Performance is critical - optimize all assets
- Use modern web standards and best practices
- Test locally before deploying to Azure
- Follow Azure Static Web Apps configuration standards
- Use Infrastructure as Code (Bicep) for Azure resources

## Deployment Strategy
- Use Azure Static Web Apps for hosting
- GitHub Actions for CI/CD
- Preview deployments for pull requests
- Production deployment on main branch

## Local Testing
- Use local development server (Live Server or similar)
- Test performance and responsiveness
- Validate all features before pushing

## Security
- No hardcoded credentials
- Use Azure Managed Identity where applicable
- Implement proper CORS policies
- HTTPS only in production
