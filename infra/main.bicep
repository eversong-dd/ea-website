// Azure Bicep template for Static Web App deployment
// Place Bicep files in the infra/ folder as per Azure best practices

@description('Name of the Static Web App')
param staticWebAppName string = 'ea-website-${uniqueString(resourceGroup().id)}'

@description('Location for the Static Web App')
param location string = resourceGroup().location

@description('SKU for the Static Web App')
@allowed([
  'Free'
  'Standard'
])
param sku string = 'Free'

@description('Tags to apply to the resource')
param tags object = {
  environment: 'production'
  project: 'ea-website'
}

// Static Web App resource
resource staticWebApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name: staticWebAppName
  location: location
  tags: tags
  sku: {
    name: sku
    tier: sku
  }
  properties: {
    // Repository configuration will be set up via GitHub Actions
    buildProperties: {
      appLocation: '/src'
      apiLocation: ''
      outputLocation: ''
    }
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    // Enterprise-grade configuration can be added in Standard tier
  }
}

// Outputs for reference
output staticWebAppId string = staticWebApp.id
output staticWebAppDefaultHostname string = staticWebApp.properties.defaultHostname
output staticWebAppName string = staticWebApp.name
