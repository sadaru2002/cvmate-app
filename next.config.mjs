/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  
  // CRITICAL: External packages to prevent bundling
  serverExternalPackages: [
    'playwright-aws-lambda',
    'playwright-core',
    'playwright',
    'mongodb' // Also externalize mongodb as it's a server-side dependency
  ],
  
  // Additional webpack configuration to exclude problematic modules
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude Playwright packages from bundling
      config.externals.push(
        'playwright-aws-lambda',
        'playwright-core', 
        'playwright',
        // Exclude the problematic chromium-bidi modules
        'chromium-bidi',
        'electron'
      );
    }
    return config;
  }
}

export default nextConfig