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
  webpack: (config, { isServer }) => {
    if (isServer) {
      // External playwright dependencies for server-side
      config.externals = [
        ...config.externals,
        'playwright-aws-lambda',
        'playwright-core',
        'chromium-bidi',
        'electron',
      ];
    }
    // Ignore binary files
    config.module.rules.push({
      test: /\.(ttf|woff|woff2)$/,
      type: 'asset/resource',
    });
    return config;
  },
}

export default nextConfig