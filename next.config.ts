import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['playwright-core', '@sparticuz/chromium', 'sharp'],
  outputFileTracingIncludes: {
    '/api/admin/templates': ['./node_modules/@sparticuz/chromium/bin/**/*'],
  },
  experimental: {
    // Allow a 100 MB template, a 3 MB cover, and multipart form overhead.
    proxyClientMaxBodySize: "105mb",
  },
};

export default config;
