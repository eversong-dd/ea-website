// Web App Service module for Next.js application
// Environment-specific tiers: Test (B1) for cost savings, Prod (S1) for performance

@description('Primary Azure region')
param location string

@description('Unique resource token')
param resourceToken string

@description('Resource tags')
param tags object

@description('Environment name (test = B1, prod = S1)')
param environmentName string

@description('Managed Identity resource ID')
param managedIdentityId string

@description('Application Insights connection string')
param appInsightsConnectionString string

@description('Storage account name for video assets')
param storageAccountName string

@description('Log Analytics Workspace ID for diagnostics')
param logAnalyticsWorkspaceId string

// Determine SKU based on environment
var isTestEnvironment = environmentName == 'test'
var appServiceSku = isTestEnvironment ? {
  name: 'B1'
  tier: 'Basic'
  size: 'B1'
  family: 'B'
  capacity: 1
} : {
  name: 'S1'
  tier: 'Standard'
  size: 'S1'
  family: 'S'
  capacity: 1
}

// Determine if Always On should be enabled (not available in Basic tier)
var alwaysOnEnabled = !isTestEnvironment

// App Service Plan (B1 for test, S1 for prod)
resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: 'asp-${resourceToken}'
  location: location
  tags: tags
  sku: appServiceSku
  kind: 'linux'
  properties: {
    reserved: true // Linux App Service Plan
    zoneRedundant: false
  }
}

// Web App Service for Next.js
resource webApp 'Microsoft.Web/sites@2023-12-01' = {
  name: 'app-${resourceToken}'
  location: location
  tags: union(tags, {
    'azd-service-name': 'web' // Required for azd deployment
  })
  kind: 'app,linux'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentityId}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    clientAffinityEnabled: false
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      alwaysOn: alwaysOnEnabled
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      http20Enabled: true
      appCommandLine: 'npm start'
      appSettings: [
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'PORT'
          value: '8080'
        }
        {
          name: 'NEXT_TELEMETRY_DISABLED'
          value: '1'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsightsConnectionString
        }
        {
          name: 'AZURE_STORAGE_ACCOUNT_NAME'
          value: storageAccountName
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
      ]
      cors: {
        allowedOrigins: [
          'https://portal.azure.com'
        ]
        supportCredentials: false
      }
      httpLoggingEnabled: true
      logsDirectorySizeLimit: 35
      detailedErrorLoggingEnabled: true
    }
  }
}

// Diagnostic settings for monitoring
resource diagnosticSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'webapp-diagnostics'
  scope: webApp
  properties: {
    workspaceId: logAnalyticsWorkspaceId
    logs: [
      {
        category: 'AppServiceHTTPLogs'
        enabled: true
      }
      {
        category: 'AppServiceConsoleLogs'
        enabled: true
      }
      {
        category: 'AppServiceAppLogs'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
      }
    ]
  }
}

@description('Web App hostname')
output webAppHostName string = webApp.properties.defaultHostName

@description('Web App resource ID')
output webAppId string = webApp.id

@description('Web App name')
output webAppName string = webApp.name
