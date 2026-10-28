import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Placeholders (temporário — remover depois)
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      // Amazon
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      // Mercado Livre
      {
        protocol: "https",
        hostname: "http2.mlstatic.com",
      },
      // Shopee
      {
        protocol: "https",
        hostname: "cf.shopee.com.br",
      },
      // Magalu
      {
        protocol: "https",
        hostname: "static.magazineluiza.com.br",
      },
    ],
  },
};

export default nextConfig;