const { withSentryConfig } = require("@sentry/nextjs");

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

module.exports = withSentryConfig(nextConfig, {
  // Sentry organisation + project (from sentry.io)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only upload source maps in CI/production (keeps local builds fast)
  silent: true, // suppress Sentry CLI output
  disableLogger: true,

  // Source maps: upload and then delete from deployed bundle
  widenClientFileUpload: true,
  hideSourceMaps: true,

  // Automatically instrument routes for performance tracing
  autoInstrumentServerFunctions: true,

  // Tunnel sentry requests through your domain (avoids ad-blockers)
  tunnelRoute: "/monitoring",
});
