import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const backendOrigin = process.env.BACKEND_ORIGIN?.replace(/\/$/, "");
const assetOrigin = process.env.NEXT_PUBLIC_ASSET_ORIGIN?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,

  allowedDevOrigins: (
    process.env.NEXT_ALLOWED_DEV_ORIGINS ??
    "localhost,127.0.0.1,192.168.*.*,10.*.*.*,172.16.*.*"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),

  async rewrites() {
    return [
      ...(backendOrigin
        ? [
            {
              source: "/api/v1/:path*",
              destination: `${backendOrigin}/api/v1/:path*`,
            },
          ]
        : []),
      ...(assetOrigin
        ? [
            {
              source: "/uploads/:path*",
              destination: `${assetOrigin}/uploads/:path*`,
            },
          ]
        : []),
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
        search: "",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
