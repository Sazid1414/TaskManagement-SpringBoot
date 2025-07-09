import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true, // For development speed
  },
  typescript: {
    ignoreBuildErrors: true, // For development speed
  }
};

export default nextConfig;
