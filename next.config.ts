import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.gulbenesms.lv',
      },
    ],
  },
};

export default nextConfig;
