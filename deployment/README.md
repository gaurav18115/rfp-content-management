# Deployment Guide

## RFP Contract Management System Deployment

**Project Timeline**: 2 hours  
**Focus**: Quick deployment for MVP demonstration  

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended - 5 minutes)

1. **Connect Repository**

   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from project directory
   vercel
   ```

2. **Environment Variables**
   - Set `NEXT_PUBLIC_SUPABASE_URL`
   - Set `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Automatic Deployments**
   - Push to main branch triggers auto-deploy
   - Preview deployments for pull requests

### Option 2: Netlify (5 minutes)

1. **Connect Repository**
   - Link GitHub repository in Netlify dashboard
   - Build command: `pnpm run build`
   - Publish directory: `.next`

2. **Environment Variables**
   - Add Supabase environment variables
   - Redeploy after adding variables

### Option 3: Railway (10 minutes)

1. **Deploy from GitHub**
   - Connect repository in Railway dashboard
   - Auto-detects Next.js project
   - Sets up build and deployment

## 🛠️ Manual Deployment

### Prerequisites

- Node.js 18+
- pnpm package manager
- Supabase project configured

### Build Process

```bash
# Install dependencies
pnpm install

# Build for production
pnpm run build

# Start production server
pnpm run start
```

### Environment Configuration

```bash
# Copy example environment file
cp .env.example .env.local

# Update with production values
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 🌐 Domain & SSL

### Custom Domain Setup

1. **DNS Configuration**

   ```
   Type: CNAME
   Name: www
   Value: your-app.vercel.app
   ```

2. **SSL Certificate**
   - Automatically handled by Vercel/Netlify
   - Force HTTPS redirect enabled

### Subdomain Setup

```
Type: CNAME
Name: rfp
Value: your-app.vercel.app
```

## 📊 Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
pnpm run build
# Check .next/analyze/ for bundle analysis

# Optimize images
# Use Next.js Image component with proper sizing
```

### Runtime Optimization

- Enable Supabase connection pooling
- Implement proper caching headers
- Use CDN for static assets

## 🔒 Security Configuration

### Environment Variables

```bash
# Required for production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional security enhancements
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com
```

### Supabase Security

1. **Row Level Security (RLS)**
   - Enable on all tables
   - Test policies thoroughly

2. **API Rate Limiting**
   - Configure in Supabase dashboard
   - Set appropriate limits per endpoint

3. **CORS Configuration**

   ```sql
   -- In Supabase SQL editor
   UPDATE auth.config 
   SET site_url = 'https://your-domain.com';
   ```

## 📱 Mobile Optimization

### PWA Configuration

```json
// next.config.ts
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});
```

### Responsive Design

- Mobile-first approach implemented
- Touch-friendly interface elements
- Optimized for various screen sizes

## 🔍 Monitoring & Analytics

### Vercel Analytics

```bash
# Install Vercel analytics
pnpm add @vercel/analytics

# Add to app layout
import { Analytics } from '@vercel/analytics/react';
```

### Error Tracking

```bash
# Install Sentry for error tracking
pnpm add @sentry/nextjs

# Configure in next.config.ts
const { withSentryConfig } = require('@sentry/nextjs');
```

## 🧪 Testing Deployment

### Health Check Endpoint

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
}
```

### Smoke Tests

1. **Authentication Flow**
   - User registration
   - User login
   - Role-based access

2. **Core Functionality**
   - RFP creation
   - Response submission
   - Document upload

3. **Performance Tests**
   - Page load times
   - API response times
   - Database query performance

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**

   ```bash
   # Clear Next.js cache
   rm -rf .next
   pnpm run build
   ```

2. **Environment Variables**
   - Verify all required variables are set
   - Check for typos in variable names
   - Ensure proper formatting

3. **Database Connection**
   - Verify Supabase project is active
   - Check RLS policies are correct
   - Test connection in Supabase dashboard

### Debug Mode

```bash
# Enable debug logging
DEBUG=* pnpm run dev

# Check Supabase logs
# Monitor in Supabase dashboard > Logs
```

## 📈 Scaling Considerations

### Database Scaling

- Supabase automatically scales PostgreSQL
- Monitor connection usage
- Implement connection pooling if needed

### Application Scaling

- Vercel/Netlify auto-scales based on traffic
- Consider edge functions for global performance
- Implement proper caching strategies

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm run build
      - run: pnpm run test
```

### Automated Testing

```bash
# Run tests before deployment
pnpm run test
pnpm run lint
pnpm run type-check
```

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] RLS policies tested
- [ ] Build successful locally

### Post-Deployment

- [ ] Health check endpoint responding
- [ ] Authentication working
- [ ] Core features functional
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] SSL certificate valid

### Monitoring

- [ ] Error tracking configured
- [ ] Analytics enabled
- [ ] Performance monitoring active
- [ ] Database metrics visible

## 🎯 MVP Deployment Timeline

### Phase 1: Quick Deploy (15 min)

1. Choose deployment platform
2. Connect repository
3. Configure environment variables
4. Deploy application

### Phase 2: Configuration (15 min)

1. Set up custom domain (optional)
2. Configure Supabase security
3. Test core functionality
4. Verify mobile responsiveness

### Phase 3: Testing & Polish (30 min)

1. Run smoke tests
2. Fix any issues
3. Optimize performance
4. Document deployment

---

**Last Updated**: December 2024  
**Version**: 1.0.0-alpha  
**Timeline**: 2 Hours MVP
