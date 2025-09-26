# 🚀 CVMate Next.js - Vercel Deployment Guide

This project is optimized for deployment on **Vercel** with serverless-compatible PDF generation using `@sparticuz/chromium`.

## 🎯 Why Vercel?

- ✅ **Free Tier**: Generous free tier for personal projects
- ✅ **Serverless Optimized**: Built for Next.js applications
- ✅ **Easy Deployment**: Git-based deployment with zero configuration
- ✅ **Global CDN**: Fast content delivery worldwide
- ✅ **Automatic HTTPS**: SSL certificates included

## 📦 Serverless PDF Generation Stack

### Dependencies
- **puppeteer-core**: Lightweight Puppeteer for serverless
- **@sparticuz/chromium**: Serverless-optimized Chromium binary
- **Fallback System**: Multiple quality tiers for reliability

### PDF Generation Features
- ✅ **Vector-based PDFs**: Text selectability and clickable links
- ✅ **High-quality fallbacks**: Image-based PDFs when needed
- ✅ **Serverless compatible**: Works within Vercel's 50MB limit
- ✅ **Multi-tier system**: Server-side → Client-side → Print dialog

## 🛠️ Quick Deployment Steps

### 1. Environment Variables
Set these in your Vercel dashboard (`Settings > Environment Variables`):

```env
# Authentication
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="https://your-project.vercel.app"
JWT_SECRET="your_jwt_secret"

# Database
MONGO_URL="your_mongodb_connection_string"

# File Storage
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# AI Integration
GEMINI_API_KEY="your_gemini_api_key"
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Option B: Git Integration
1. **Connect GitHub repository** to Vercel
2. **Import project** from your repository
3. **Configure environment variables**
4. **Deploy automatically** on push to main

### 3. Vercel Configuration

The project includes optimal settings in `next.config.mjs`:
- Webpack externals for serverless compatibility
- MongoDB and PDF generation optimizations
- Asset handling for binary files

## ⚙️ Advanced Configuration

### Function Configuration
```javascript
// In API routes
export const config = {
  maxDuration: 60, // 60 seconds for PDF generation
  memory: 1024,    // 1GB memory for Chrome
}
```

### Build Optimizations
```json
// Automatic via package.json
{
  "scripts": {
    "build": "pnpm install --no-frozen-lockfile && next build"
  }
}
```

## 🔍 PDF Generation Flow

### 1. Primary: Vector-based PDF (`/api/generate-pdf-vector`)
- Uses `@sparticuz/chromium` in production
- Falls back to local Chrome in development
- Preserves text selection and clickable links
- Optimized for serverless constraints

### 2. Fallback: Server-side PDF (`/api/generate-pdf`)
- Traditional Puppeteer approach
- Image-based when vector fails
- Multiple quality levels

### 3. Final Fallback: Client-side PDF
- Browser-based generation using `html2canvas` + `jsPDF`
- Works when server-side fails
- Print dialog option for perfect fidelity

## 📊 Performance & Limits

### Vercel Limits
- **Function Duration**: Up to 60 seconds (configured)
- **Memory**: Up to 1GB (recommended for Chrome)
- **Bundle Size**: 50MB limit (met with @sparticuz/chromium)
- **Cold Starts**: ~1-3 seconds typical

### Expected Performance
- **Build Time**: ~1-2 minutes
- **PDF Generation**: ~2-4 seconds
- **Memory Usage**: ~300-600MB during generation
- **Success Rate**: >95% with fallback system

## 🐛 Troubleshooting

### Common Issues

1. **PDF Generation Timeout**
   ```bash
   # Check function duration
   # Increase maxDuration if needed (max 60s on Hobby plan)
   ```

2. **Memory Issues**
   ```bash
   # Upgrade to Pro plan for more memory
   # Or optimize PDF generation settings
   ```

3. **Build Failures**
   ```bash
   # Check dependencies are correct:
   # - puppeteer-core (not puppeteer)
   # - @sparticuz/chromium
   ```

### Debug Commands
```bash
# Test locally
npm run dev

# Check bundle size
npm run build

# Verify PDF generation
# Navigate to /resume-builder and test download
```

## 🔐 Security & Best Practices

### Environment Variables
- Never commit secrets to Git
- Use Vercel's environment variable encryption
- Set different values for Preview vs Production

### API Security
- All PDF generation is server-side
- Input validation on all endpoints
- Rate limiting via Vercel's built-in protection

## 📈 Scaling Considerations

### Free Tier Limits
- 100GB bandwidth/month
- 100,000 function invocations/month
- 100 hours function execution/month

### Upgrade Triggers
- High PDF generation volume
- Need for longer function timeouts
- Advanced analytics requirements

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] MongoDB connection tested
- [ ] PDF generation tested in preview deployment
- [ ] Domain configured (if custom)
- [ ] Analytics enabled (optional)

---

**🎉 Ready to deploy!** Your CVMate application is fully configured for Vercel deployment with reliable PDF generation.