import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Spline to load external scenes
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'prod.spline.design' },
    ],
  },
  // Spline runtime must run on the client side only
  serverExternalPackages: [],
};

export default nextConfig;
