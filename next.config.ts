import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/pharmacy/signin',
        destination: '/pharmacy-signin',
      },
      {
        source: '/pharmacy/signup',
        destination: '/pharmacy-signup',
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
