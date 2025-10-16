/** @type {import('next').NextConfig} */
const nextConfig = {
  // your config
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.coinstats.app',
        port: '',
        pathname: '/coins/**',
      },
    ],
  },
}

export default nextConfig
