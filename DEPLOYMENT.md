# Deployment Guide

## Environment Configuration

The application uses different API URLs for development and production:

- **Development**: `/api/v1` (proxied to `https://team-pulse-bend.onrender.com` via Vite)
- **Production**: `https://team-pulse-bend.onrender.com/api/v1` (direct connection)

## Netlify Deployment

### Automatic Configuration (Recommended)

The `netlify.toml` file automatically configures:
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL`
- SPA redirect rules
- Security headers

### Manual Configuration (If needed)

If you need to set environment variables manually in Netlify:

1. Go to **Site settings** → **Environment variables**
2. Add the following variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://team-pulse-bend.onrender.com/api/v1`

### Deploy Steps

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Add production environment configuration"
   git push origin main
   ```

2. **Deploy on Netlify**
   - Go to https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"
   - Connect to your GitHub repository
   - Netlify will auto-detect the `netlify.toml` configuration
   - Click "Deploy site"

3. **Verify Environment Variable**
   - After deployment, go to Site settings → Environment variables
   - Confirm `VITE_API_URL` is set to `https://team-pulse-bend.onrender.com/api/v1`

4. **Test the Deployment**
   - Visit your Netlify URL (e.g., https://your-site.netlify.app)
   - Open browser DevTools → Network tab
   - Try to sign up or log in
   - Verify API calls go to `https://team-pulse-bend.onrender.com/api/v1/...`

## Troubleshooting

### Issue: API calls go to Netlify URL instead of backend

**Symptoms**:
```
GET https://your-site.netlify.app/api/v1/public/teams/
404 Not Found
```

**Solution**:
1. Check if `VITE_API_URL` environment variable is set in Netlify
2. Rebuild the site: Site overview → Trigger deploy → Deploy site
3. Clear browser cache and test again

### Issue: CORS errors

**Symptoms**:
```
Access to fetch at 'https://team-pulse-bend.onrender.com/api/v1/...' 
from origin 'https://your-site.netlify.app' has been blocked by CORS policy
```

**Solution**: Update backend CORS configuration to allow your Netlify domain:

```python
# Django settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Development
    "https://your-site.netlify.app",  # Production
    "https://mary-kanyingi-pulse.netlify.app",  # Your current site
]
```

### Issue: Tokens not persisting

**Symptoms**: User logged out on page refresh

**Cause**: Backend not setting HTTP-only cookies (see SECURITY_TOKEN_IMPLEMENTATION.md)

**Temporary Workaround**: This is expected behavior until backend implements HTTP-only cookies

## Environment Files

- `.env.development` - Development settings (uses proxy)
- `.env.production` - Production settings (direct backend URL)
- `.env.example` - Template for local overrides
- `netlify.toml` - Netlify build configuration

## Build Locally for Production

To test production build locally:

```bash
# Build with production env
npm run build

# Preview the production build
npm run preview
```

This will use `.env.production` settings.

## Quick Fix for Current Deployment

To fix your current Netlify deployment immediately:

1. Go to Netlify dashboard → Your site
2. Site settings → Environment variables
3. Click "Add a variable"
4. Key: `VITE_API_URL`
5. Value: `https://team-pulse-bend.onrender.com/api/v1`
6. Click "Save"
7. Go back to Deploys → Trigger deploy → Clear cache and deploy site

## Verification Checklist

After deployment, verify:

- [ ] Site loads without errors
- [ ] Sign up page shows team dropdown (fetches from `/public/teams/`)
- [ ] API calls go to `https://team-pulse-bend.onrender.com` (check Network tab)
- [ ] Login works and redirects to dashboard
- [ ] Backend CORS allows your Netlify domain

## Notes

- Environment variables starting with `VITE_` are exposed to the client
- The `.env.production` file is used during `npm run build`
- Netlify automatically uses `.env.production` for production builds
- `netlify.toml` overrides `.env.production` if both exist
