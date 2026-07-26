import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  transpilePackages: ["@busla/ui", "@busla/api-client-ts", "@busla/tokens"],
  webpack: (config) => {
    // The workspace TS packages import with `.js` extensions (e.g. "./status.js");
    // let webpack resolve those to the actual .ts/.tsx sources.
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js"],
      ".mjs": [".mts", ".mjs"],
    };
    return config;
  },
};

export default withNextIntl(nextConfig);
