import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['pdfjs-dist'],
  experimental: {
    cpus: 1,
  },
};

export default nextConfig;
