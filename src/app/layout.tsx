import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EmCheio — Achou em cheio. Pagou menos.",
  description:
    "As melhores ofertas da Amazon, Mercado Livre, Shopee e mais — tudo em um só lugar.",
  keywords: [
    "ofertas",
    "promoções",
    "cupons",
    "desconto",
    "guia de compras",
    "amazon",
    "mercado livre",
    "shopee",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full flex flex-col antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}