# 🚀 CVMate Next.js - Render.com Deployment Guide

This project is optimized for deployment on **Render.com**, which provides excellent support for Puppeteer and PDF generation without the complexity of serverless environments.

## 🎯 Why Render.com?

- ✅ **Full Puppeteer Support**: No limitations on browser automation
- ✅ **Persistent Processes**: Better for PDF generation workloads
- ✅ **No Cold Starts**: Improved performance for PDF generation
- ✅ **Simple Configuration**: Easy deployment and scaling

## 📦 Pre-configured Features

### PDF Generation Stack
- **Primary**: Vector-based PDF generation with selectable text and clickable links
- **Fallback**: High-quality image-based PDF generation
- **Browser**: Full Puppeteer with Chrome (installed via postinstall script)

### Dependencies Optimized
- ✅ Standard `puppeteer` (not puppeteer-core)
- ✅ Automatic Chrome installation via postinstall script
- ✅ Render.com specific browser launch arguments

## 🛠️ Quick Deployment Steps

### 1. Prepare Environment Variables
Create these environment variables in your Render.com dashboard:

```env
# Required Environment Variables
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
NEXTAUTH_SECRET="your_nextauth_secret"
MONGO_URL="your_mongodb_connection_string"
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
GEMINI_API_KEY="your_gemini_api_key"
NEXTAUTH_URL="https://your-app-name.onrender.com"
JWT_SECRET="your_jwt_secret"

# Puppeteer Configuration (Optional - defaults provided)
NODE_ENV=production
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
```

### 2. Deploy via Git Repository

1. **Connect your GitHub repository** to Render.com
2. **Configure the service:**
   - **Runtime**: Node.js
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Starter (can upgrade later)

3. **Enable Auto-Deploy** from your main branch

### 3. Alternative: Deploy via render.yaml (Recommended)

The project includes a `render.yaml` file for infrastructure-as-code deployment:

```yaml
services:
  - type: web
    name: cvmate-next
    runtime: node
    plan: starter
    buildCommand: npm run build
    startCommand: npm start
    healthCheckPath: /
    autoDeploy: false
```

Simply commit this file and Render.com will automatically configure your service.

### 4. Docker Deployment (Advanced)

The project includes a `Dockerfile` optimized for Render.com:

```dockerfile
FROM node:18-slim
# Includes Google Chrome installation and all dependencies
```

## 🔧 Configuration Details

### Puppeteer Configuration
- **Chrome Installation**: Automatic via postinstall script
- **Launch Args**: Optimized for containerized environments
- **Memory Usage**: Efficient for Render.com's resource limits

### PDF Generation
- **Vector PDFs**: Full text selection and clickable links
- **High Quality**: 1200x1600 default viewport for crisp rendering
- **Fallback System**: Multiple quality tiers for reliability

## 🚦 Health Checks & Monitoring

The application includes:
- **Health Check Endpoint**: `/` (automatic)
- **Build Status**: Visible in Render.com dashboard
- **Logs**: Real-time via Render.com interface

## 📈 Scaling Configuration

Current setup supports:
- **Min Instances**: 1 (always available)
- **Max Instances**: 3 (auto-scaling)
- **Resource Allocation**: Optimized for PDF generation

## 🐛 Troubleshooting

### Common Issues

1. **PDF Generation Fails**:
   - Check that Chrome installed properly in logs
   - Verify environment variables are set
   - Monitor memory usage

2. **Build Failures**:
   - Ensure all environment variables are set
   - Check pnpm lockfile integrity
   - Review build logs for specific errors

3. **Performance Issues**:
   - Consider upgrading to Standard plan
   - Check PDF generation memory usage
   - Monitor response times

### Debug Commands

```bash
# Check Chrome installation
npx puppeteer browsers list

# Test PDF generation locally
npm run dev
# Navigate to /resume-builder and test PDF download
```

## 📊 Performance Expectations

- **Build Time**: ~2-3 minutes
- **Cold Start**: ~5 seconds (no cold starts after first request)
- **PDF Generation**: ~3-5 seconds for standard resumes
- **Memory Usage**: ~200-400MB during PDF generation

## 🔐 Security Notes

- All API routes are server-side rendered
- Authentication via NextAuth.js with Google OAuth
- MongoDB connection with proper authentication
- Environment variables securely managed

## 📞 Support

For deployment issues:
1. Check Render.com documentation
2. Review application logs in dashboard
3. Test locally first with `npm run dev`

---

**🎉 Ready to deploy!** Your CVMate application is fully configured for Render.com deployment with high-quality PDF generation support.