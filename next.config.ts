import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.discordapp.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "fgdkkcjphcbyhmjzdpxs.supabase.co" },
    ],
  },
};

export default nextConfig;
