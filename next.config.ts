import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: '/tmp/storysteps-next',
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
