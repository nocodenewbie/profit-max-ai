# Production Setup Guide

This guide will help you configure the application for production deployment.

## Prerequisites

Before deploying to production, ensure you have:
- ✅ A Supabase project
- ✅ A Stripe account (with production keys)
- ✅ Google OAuth credentials (if using Google Sign-In)

## Step 1: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the consent screen with your app details
6. Add authorized JavaScript origins:
   - Development: `http://localhost:8080`
   - Production: `https://yourdomain.com`
7. Add authorized redirect URIs:
   - Development: `http://localhost:8080/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
8. Copy your **Client ID** and **Client Secret**

### Configure in Supabase

1. Go to your Supabase Dashboard → **Authentication** → **Providers**
2. Enable Google provider
3. Enter your Client ID and Client Secret
4. Add your site URL under **Authentication** → **URL Configuration**:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: Add both development and production URLs

## Step 2: Stripe Configuration

### Development (Test Mode)
Your current configuration uses Stripe test keys:
- Publishable Key: `pk_test_...`
- Secret Key: `sk_test_...` (configured in Supabase Edge Functions)

### Production (Live Mode)

1. Log into your [Stripe Dashboard](https://dashboard.stripe.com/)
2. Switch to **Live mode** (toggle in top-right)
3. Go to **Developers** → **API Keys**
4. Copy your **Publishable key** (starts with `pk_live_`)
5. Copy your **Secret key** (starts with `sk_live_`)

**⚠️ IMPORTANT:** Keep your secret key secure! Never commit it to version control.

### Update Environment Variables

1. Update `.env` file:
```bash
VITE_STRIPE_PUBLISHABLE_KEY="pk_live_YOUR_PRODUCTION_KEY"
```

2. Update Supabase Edge Function Secret:
   - Go to Supabase Dashboard → **Edge Functions** → **Secrets**
   - Update `STRIPE_SECRET_KEY` with your production secret key (`sk_live_...`)

## Step 3: Supabase Production Configuration

### Email Confirmation

For testing, you may want to disable email confirmation:
1. Go to Supabase Dashboard → **Authentication** → **Settings**
2. Under **Email Auth**, toggle off "Confirm email"
3. **For production**, keep email confirmation **enabled** for security

### URL Configuration

Set proper URLs in Supabase Dashboard → **Authentication** → **URL Configuration**:
- **Site URL**: Your production domain (e.g., `https://yourdomain.com`)
- **Redirect URLs**: Add all valid redirect URLs:
  - `https://yourdomain.com/**`
  - `http://localhost:8080/**` (for local development)

### Row Level Security (RLS)

Ensure all RLS policies are enabled and properly configured:
1. Check database tables have RLS enabled
2. Verify policies allow appropriate access
3. Test with production user accounts

## Step 4: Environment Variable Checklist

Before deploying, verify all environment variables:

### Frontend (.env)
```bash
VITE_SUPABASE_PROJECT_ID="blkgutzpmwmjuadznwwp"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://blkgutzpmwmjuadznwwp.supabase.co"
VITE_STRIPE_PUBLISHABLE_KEY="pk_live_YOUR_KEY" # Use pk_live_ for production
```

### Supabase Edge Functions (Set in Dashboard)
- `STRIPE_SECRET_KEY`: `sk_live_YOUR_KEY` (for production)

## Step 5: Deployment Checklist

Before going live:

- [ ] Google OAuth configured with production redirect URLs
- [ ] Stripe live mode keys configured
- [ ] Supabase URL configuration updated with production domain
- [ ] Email confirmation settings configured appropriately
- [ ] All RLS policies verified
- [ ] Edge functions deployed and tested
- [ ] Payment flow tested end-to-end with test cards
- [ ] SSL certificate configured (HTTPS)
- [ ] Custom domain configured (if applicable)

## Step 6: Testing Production Setup

### Test Authentication
1. Try registering with email/password
2. Test Google OAuth login
3. Verify email confirmation flow (if enabled)
4. Test logout functionality

### Test Payment Flow
1. Use [Stripe test cards](https://stripe.com/docs/testing) in test mode
2. Verify payment success page redirects correctly
3. Check that payment records appear in Supabase
4. Test with real card in production (small amount)

### Test Protected Routes
1. Verify unauthenticated users redirect to login
2. Verify unpaid users redirect to paywall
3. Verify paid users can access dashboard

## Step 7: Monitoring & Maintenance

### Stripe Webhooks (Optional but Recommended)
For production reliability, consider setting up Stripe webhooks:
1. Stripe Dashboard → **Developers** → **Webhooks**
2. Add endpoint: `https://yourdomain.com/api/stripe-webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Update edge function to handle webhook events

### Error Monitoring
Monitor these logs regularly:
- Supabase Edge Function logs
- Browser console errors (in production)
- Stripe Dashboard for failed payments
- Supabase Auth logs

## Rollback Plan

If issues occur in production:

1. **Revert to test mode**: Change Stripe keys back to test mode
2. **Disable Google OAuth**: Remove from login/register pages temporarily
3. **Check Supabase logs**: Review edge function and auth logs
4. **Verify environment variables**: Ensure all variables are set correctly

## Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

## Security Best Practices

1. **Never commit secrets** to version control
2. **Use environment variables** for all sensitive data
3. **Enable RLS** on all database tables
4. **Use HTTPS** in production
5. **Regularly rotate** API keys and secrets
6. **Monitor** for suspicious activity
7. **Keep dependencies** up to date

---

For questions or issues, refer to the project documentation or contact support.
