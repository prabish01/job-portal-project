/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '20.40.45.194',
        port: '',
        pathname: '/api/**',
      },
    ],
  },
};

module.exports = nextConfig;
