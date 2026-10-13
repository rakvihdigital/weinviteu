import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Template uploads (single-file HTML with embedded media) go up to 50 MB; see api/admin/templates.
    proxyClientMaxBodySize: "50mb",
  },
};

export default config;
