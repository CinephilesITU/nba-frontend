/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://134.122.55.126:5001/api/v1/:path*',
      },
    ]
  },
};

export default nextConfig;