import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/veranda-27",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/veranda-27/",
        destination: "/projects",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
