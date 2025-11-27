import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Config options here */
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://134.122.55.126:5001/api/v1/:path*', // Backend IP adresin
      },
    ]
  },
};

export default nextConfig;