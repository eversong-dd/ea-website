// Main Bicep template for ea-website deployment
// Deploys a high-performance Next.js application to Azure Web App Service
// with CDN, monitoring, and storage for video assets

targetScope = 'resourceGroup'

// Required parameters for azd compatibility
@minLength(1)
@maxLength(64)
@description('Name of the environment (used for resource naming)')
param environmentName string

@minLength(1)
@description('Primary Azure region for all resources')
param location string = resourceGroup().location

@description('Unique token for resource naming to avoid conflicts')
var resourceToken = uniqueString(subscription().id, resourceGroup().id, location, environmentName)

@description('Tags to apply to all resources')
var tags = {
  'azd-env-name': environmentName
  Environment: environmentName
  Application: 'ea-website'
  ManagedBy: 'Bicep'
}

// User-Assigned Managed Identity (required for azd)
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'id-${resourceToken}'
  location: location
  tags: tags
}

// Log Analytics Workspace for centralized logging
module monitoring 'modules/monitoring.bicep' = {
  name: 'monitoring-deployment'
  params: {
    location: location
    resourceToken: resourceToken
    tags: tags
  }
}

// Storage Account for video assets and static content
module storage 'modules/storage.bicep' = {
  name: 'storage-deployment'
  params: {
    location: location
    resourceToken: resourceToken
    tags: tags
    managedIdentityPrincipalId: managedIdentity.properties.principalId
  }
}

// Azure Web App Service for Next.js application
module webApp 'modules/web-app.bicep' = {
  name: 'webapp-deployment'
  params: {
    location: location
    resourceToken: resourceToken
    tags: tags
    managedIdentityId: managedIdentity.id
    appInsightsConnectionString: monitoring.outputs.appInsightsConnectionString
    storageAccountName: storage.outputs.storageAccountName
  }
}

// Outputs required by azd
@description('Resource Group ID for azd')
output RESOURCE_GROUP_ID string = resourceGroup().id

@description('Web App Service hostname')
output WEB_APP_HOSTNAME string = webApp.outputs.webAppHostName

@description('Web App Service URL')
output WEB_APP_URL string = 'https://${webApp.outputs.webAppHostName}'

@description('Application Insights Connection String')
output APPLICATIONINSIGHTS_CONNECTION_STRING string = monitoring.outputs.appInsightsConnectionString

@description('Storage Account Name for video assets')
output STORAGE_ACCOUNT_NAME string = storage.outputs.storageAccountName

@description('Managed Identity Client ID')
output MANAGED_IDENTITY_CLIENT_ID string = managedIdentity.properties.clientId
