/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Local development (XAMPP)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '80',
        pathname: '/gkjtangerang/assets/images/**',
      },
      // Production - add your server domain when deploying
      // {
      //   protocol: 'https',
      //   hostname: 'your-domain.com',
      //   pathname: '/**',
      // },
    ],
  },
};

export default nextConfig;
