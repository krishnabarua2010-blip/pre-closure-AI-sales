import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Allow Spline to load external scenes
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'prod.spline.design' },
    ],
  },
  // Spline runtime must run on the client side only
  serverExternalPackages: [],
};

export default nextConfig;
