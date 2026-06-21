module.exports = {
  reactStrictMode: true,
  // swcMinify removed due to Turbopack warning
  images: {
    // Next.js image usage disabled in favor of plain img for iOS, but allowing cloudinary in case it's used
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  env: {},
  async rewrites(){return [];},
};