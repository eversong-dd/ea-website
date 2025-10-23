// Azure Front Door module for global CDN and custom domains
// Single Front Door instance serving both test and prod environments

@description('Unique resource token')
param resourceToken string

@description('Resource tags')
param tags object

@description('Test environment App Service hostname')
param testOriginHostname string

@description('Production environment App Service hostname')
param prodOriginHostname string

@description('Test custom domain (e.g., test.eversong.ai)')
param testCustomDomain string

@description('Production custom domain (e.g., www.eversong.ai)')
param prodCustomDomain string

// Front Door Profile (Standard tier)
resource frontDoorProfile 'Microsoft.Cdn/profiles@2024-02-01' = {
  name: 'fd-${resourceToken}'
  location: 'Global'
  tags: tags
  sku: {
    name: 'Standard_AzureFrontDoor'
  }
}

// Front Door Endpoint
resource frontDoorEndpoint 'Microsoft.Cdn/profiles/afdEndpoints@2024-02-01' = {
  name: 'ep-${resourceToken}'
  parent: frontDoorProfile
  location: 'Global'
  properties: {
    enabledState: 'Enabled'
  }
}

// Origin Group for Test Environment
resource testOriginGroup 'Microsoft.Cdn/profiles/originGroups@2024-02-01' = {
  name: 'og-test'
  parent: frontDoorProfile
  properties: {
    loadBalancingSettings: {
      sampleSize: 4
      successfulSamplesRequired: 3
      additionalLatencyInMilliseconds: 50
    }
    healthProbeSettings: {
      probePath: '/'
      probeRequestType: 'HEAD'
      probeProtocol: 'Https'
      probeIntervalInSeconds: 100
    }
    sessionAffinityState: 'Disabled'
  }
}

// Origin Group for Production Environment
resource prodOriginGroup 'Microsoft.Cdn/profiles/originGroups@2024-02-01' = {
  name: 'og-prod'
  parent: frontDoorProfile
  properties: {
    loadBalancingSettings: {
      sampleSize: 4
      successfulSamplesRequired: 3
      additionalLatencyInMilliseconds: 50
    }
    healthProbeSettings: {
      probePath: '/'
      probeRequestType: 'HEAD'
      probeProtocol: 'Https'
      probeIntervalInSeconds: 100
    }
    sessionAffinityState: 'Disabled'
  }
}

// Test Origin (App Service)
resource testOrigin 'Microsoft.Cdn/profiles/originGroups/origins@2024-02-01' = {
  name: 'origin-test'
  parent: testOriginGroup
  properties: {
    hostName: testOriginHostname
    httpPort: 80
    httpsPort: 443
    originHostHeader: testOriginHostname
    priority: 1
    weight: 1000
    enabledState: 'Enabled'
    enforceCertificateNameCheck: true
  }
}

// Production Origin (App Service)
resource prodOrigin 'Microsoft.Cdn/profiles/originGroups/origins@2024-02-01' = {
  name: 'origin-prod'
  parent: prodOriginGroup
  properties: {
    hostName: prodOriginHostname
    httpPort: 80
    httpsPort: 443
    originHostHeader: prodOriginHostname
    priority: 1
    weight: 1000
    enabledState: 'Enabled'
    enforceCertificateNameCheck: true
  }
}

// Test Custom Domain
resource testCustomDomainResource 'Microsoft.Cdn/profiles/customDomains@2024-02-01' = {
  name: replace(testCustomDomain, '.', '-')
  parent: frontDoorProfile
  properties: {
    hostName: testCustomDomain
    tlsSettings: {
      certificateType: 'ManagedCertificate'
      minimumTlsVersion: 'TLS12'
    }
  }
}

// Production Custom Domain
resource prodCustomDomainResource 'Microsoft.Cdn/profiles/customDomains@2024-02-01' = {
  name: replace(prodCustomDomain, '.', '-')
  parent: frontDoorProfile
  properties: {
    hostName: prodCustomDomain
    tlsSettings: {
      certificateType: 'ManagedCertificate'
      minimumTlsVersion: 'TLS12'
    }
  }
}

// Route for Test Environment
resource testRoute 'Microsoft.Cdn/profiles/afdEndpoints/routes@2024-02-01' = {
  name: 'route-test'
  parent: frontDoorEndpoint
  properties: {
    customDomains: [
      {
        id: testCustomDomainResource.id
      }
    ]
    originGroup: {
      id: testOriginGroup.id
    }
    supportedProtocols: [
      'Http'
      'Https'
    ]
    patternsToMatch: [
      '/*'
    ]
    forwardingProtocol: 'HttpsOnly'
    linkToDefaultDomain: 'Disabled'  // Only respond to custom domain
    httpsRedirect: 'Enabled'
    enabledState: 'Enabled'
  }
  dependsOn: [
    testOrigin
  ]
}

// Route for Production Environment
resource prodRoute 'Microsoft.Cdn/profiles/afdEndpoints/routes@2024-02-01' = {
  name: 'route-prod'
  parent: frontDoorEndpoint
  properties: {
    customDomains: [
      {
        id: prodCustomDomainResource.id
      }
    ]
    originGroup: {
      id: prodOriginGroup.id
    }
    supportedProtocols: [
      'Http'
      'Https'
    ]
    patternsToMatch: [
      '/*'
    ]
    forwardingProtocol: 'HttpsOnly'
    linkToDefaultDomain: 'Disabled'  // Only respond to custom domain
    httpsRedirect: 'Enabled'
    enabledState: 'Enabled'
  }
  dependsOn: [
    prodOrigin
  ]
}

// Outputs
@description('Front Door profile name')
output frontDoorProfileName string = frontDoorProfile.name

@description('Front Door endpoint hostname')
output frontDoorEndpointHostname string = frontDoorEndpoint.properties.hostName

@description('Front Door profile ID')
output frontDoorProfileId string = frontDoorProfile.id

@description('Test custom domain validation token')
output testDomainValidationToken string = testCustomDomainResource.properties.validationProperties.validationToken

@description('Production custom domain validation token')
output prodDomainValidationToken string = prodCustomDomainResource.properties.validationProperties.validationToken
