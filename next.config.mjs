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
  
  // Removed experimental.serverExternalPackages as it's unrecognized and causing issues.
  
  // Use webpack.externals to explicitly exclude problematic modules from the server bundle
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push(
        // Use a regex to match any module starting with playwright-core or chromium-bidi
        // This should catch all internal dependencies as well.
        /^playwright-core(\/.*)?$/,
        /^chromium-bidi(\/.*)?$/,
        'playwright', // Also exclude the main 'playwright' package
        'playwright-aws-lambda', // Keep this external
        'electron', // Exclude electron
        'mongodb' // Exclude mongodb
      );
    }
    return config;
  }
}

export default nextConfig