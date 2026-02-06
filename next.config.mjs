/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from localhost (XAMPP)
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '80',
        pathname: '/gkjtangerang/assets/images/**',
      },
    ],
  },
};

export default nextConfig;
