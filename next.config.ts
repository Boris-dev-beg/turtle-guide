import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com', // Facebook
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'graph.facebook.com', // Facebook (other URL variante)
        pathname: '/**',
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
