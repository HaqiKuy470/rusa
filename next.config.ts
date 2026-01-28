/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com', // Izinkan DiceBear
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Izinkan Google Auth Images
      }
    ],
  },
};

export default nextConfig;