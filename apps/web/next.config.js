/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@slotsync/ui", "@slotsync/types", "@slotsync/database"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
