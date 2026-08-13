import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/audiophile-assets/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8787",
        pathname: "/audiophile-assets/**",
      },
    ],
  },
};

export default nextConfig;
