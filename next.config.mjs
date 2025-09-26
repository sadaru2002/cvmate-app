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
  
  experimental: { // serverExternalPackages must be nested under 'experimental'
    // CRITICAL: External packages to prevent bundling
    serverExternalPackages: [
      'playwright-aws-lambda',
      'playwright-core',
      'playwright',
      'mongodb' // Also externalize mongodb as it's a server-side dependency
    ],
  },
  
  // Removed the webpack configuration as experimental.serverExternalPackages should handle this.
  // webpack: (config, { isServer }) => {
  //   if (isServer) {
  //     config.externals.push(
  //       'playwright-aws-lambda',
  //       'playwright-core', 
  //       'playwright',
  //       'chromium-bidi',
  //       'electron'
  //     );
  //   }
  //   return config;
  // }
}

export default nextConfig