# DNS Configuration for Azure Front Door

This guide explains how to configure DNS in GoDaddy to enable custom domains for the ea-website.

## Overview

- **Test Environment**: test.eversong.ai → Test App Service via Front Door
- **Production**: www.eversong.ai → Production App Service via Front Door
- **Front Door Endpoint**: Will be created during `azd provision` (format: `ep-<token>.z01.azurefd.net`)

## Prerequisites

1. Deploy Front Door first: `azd provision` (in prod environment)
2. Get the Front Door endpoint hostname and validation tokens from Azure Portal or deployment outputs
3. Access to GoDaddy DNS management for eversong.ai domain

## Step 1: Get Front Door Information

After deploying Front Door, retrieve these values from Azure Portal:

1. Navigate to: **Resource Groups** → **rg-website-prod** → **Front Door profile** (fd-<token>)
2. Copy the **Endpoint hostname** (e.g., `ep-abc123.z01.azurefd.net`)
3. Navigate to **Custom domains** and note the validation tokens for:
   - test.eversong.ai
   - www.eversong.ai

## Step 2: Configure DNS Records in GoDaddy

### Domain Verification (Required First)

Before custom domains work, Azure needs to verify you own the domains. Add these TXT records:

1. Log into [GoDaddy Domain Manager](https://dcc.godaddy.com/)
2. Select **eversong.ai** domain
3. Go to **DNS** → **Manage Zones** → **Add Record**

**TXT Record for test.eversong.ai:**
```
Type: TXT
Name: _dnsauth.test
Value: <test-validation-token>
TTL: 600 seconds (10 minutes)
```

**TXT Record for www.eversong.ai:**
```
Type: TXT
Name: _dnsauth.www
Value: <prod-validation-token>
TTL: 600 seconds (10 minutes)
```

> **Note**: The validation tokens are available in Azure Portal after Front Door deployment.

### CNAME Records (After Verification)

Once Azure verifies domain ownership (usually within 10-30 minutes), add the CNAME records:

**CNAME for test.eversong.ai:**
```
Type: CNAME
Name: test
Value: ep-<token>.z01.azurefd.net
TTL: 3600 seconds (1 hour)
```

**CNAME for www.eversong.ai:**
```
Type: CNAME
Name: www
Value: ep-<token>.z01.azurefd.net
TTL: 3600 seconds (1 hour)
```

## Step 3: Verify Configuration

### Check DNS Propagation

Wait 5-30 minutes for DNS propagation, then verify:

**Windows PowerShell:**
```powershell
nslookup test.eversong.ai
nslookup www.eversong.ai
```

Expected output should show Front Door endpoint (ep-<token>.z01.azurefd.net)

**Alternative - Online Tool:**
Visit [https://dnschecker.org](https://dnschecker.org) and check both domains globally

### Check Domain Validation in Azure

1. Go to Azure Portal → Front Door profile → **Custom domains**
2. Both domains should show **Validation State: Approved**
3. Certificate status will change from "Pending" to "Approved" (can take up to 8 hours)

### Test Custom Domains

Once SSL certificates are approved:

**Test Environment:**
```bash
curl -I https://test.eversong.ai
```
Should return HTTP 200 and serve test environment

**Production:**
```bash
curl -I https://www.eversong.ai
```
Should return HTTP 200 and serve production environment

## Step 4: Root Domain (Optional)

If you want visitors to access `eversong.ai` (without www), you have two options:

### Option A: Redirect to www (Recommended)

Add an A record or URL forwarding in GoDaddy:

1. Go to **Domain Settings** → **Forwarding**
2. Add forwarding rule:
   - From: `eversong.ai`
   - To: `https://www.eversong.ai`
   - Type: Permanent (301)

### Option B: Azure Front Door Apex Domain

Azure Front Door supports apex domains, but requires Azure DNS or ALIAS records:

1. Transfer DNS to Azure DNS (more complex)
2. Or check if GoDaddy supports ALIAS records (limited availability)

> **Recommendation**: Use Option A (forwarding) for simplicity

## Troubleshooting

### Domain Verification Fails

- Verify TXT record syntax (no quotes in GoDaddy, exact value from Azure)
- Wait 10-30 minutes for DNS propagation
- Use `nslookup -type=TXT _dnsauth.test.eversong.ai` to verify
- Check Azure Portal for error messages

### SSL Certificate Stuck on "Pending"

- Can take up to 8 hours for Microsoft to issue certificate
- Verify domain validation is complete
- Ensure CNAME records are correctly pointing to Front Door
- Check there are no CAA DNS records blocking Microsoft certificate issuance

### Site Not Loading via Custom Domain

- Verify DNS CNAME records point to Front Door (not App Service)
- Check Front Door routes are enabled
- Verify custom domain is associated with correct route
- Check browser console for errors
- Test with `curl -v https://test.eversong.ai` for detailed connection info

### HTTP instead of HTTPS

- Front Door automatically redirects HTTP to HTTPS
- If not working, check route configuration in Azure Portal
- Verify **HTTPS Redirect** is enabled on routes

## DNS Record Summary

| Record Type | Name | Value | TTL | Purpose |
|------------|------|-------|-----|---------|
| TXT | `_dnsauth.test` | `<test-validation-token>` | 600 | Domain verification |
| TXT | `_dnsauth.www` | `<prod-validation-token>` | 600 | Domain verification |
| CNAME | `test` | `ep-<token>.z01.azurefd.net` | 3600 | Test environment |
| CNAME | `www` | `ep-<token>.z01.azurefd.net` | 3600 | Production |

## Security Considerations

- ✅ **TLS 1.2+ Only**: Front Door enforces modern TLS
- ✅ **Automatic Certificate Renewal**: Microsoft manages SSL certificate lifecycle
- ✅ **HTTPS Redirect**: All HTTP traffic redirected to HTTPS
- ✅ **DDoS Protection**: Azure DDoS Protection Standard included
- ⚠️ **CAA Records**: If you use CAA records, add: `0 issue "digicert.com"`

## Cost Impact

DNS changes have **no additional cost**. Costs are:
- Azure Front Door: ~$35-55/month (already provisioned)
- GoDaddy domain: Your existing domain registration cost

## Next Steps

After DNS is configured and SSL certificates are issued:

1. Update marketing materials with new URLs
2. Set up redirects from old .azurewebsites.net URLs (if needed)
3. Configure Google Analytics/Search Console with new domains
4. Update any API callbacks or OAuth redirect URIs
5. Test all functionality on custom domains

## Support Resources

- **Azure Front Door Docs**: https://learn.microsoft.com/en-us/azure/frontdoor/
- **GoDaddy DNS Help**: https://www.godaddy.com/help/manage-dns-zone-files-680
- **DNS Checker Tool**: https://dnschecker.org
- **SSL Checker Tool**: https://www.ssllabs.com/ssltest/
