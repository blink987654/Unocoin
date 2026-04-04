import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IndiaBitcoin.com — India's Bitcoin Platform",
  description:
    "India's premier Bitcoin platform. 13 years of trust, innovation, and building the future of money. Buy, sell, and hold Bitcoin with India's most trusted exchange. Powered by Unocoin.",
  keywords: [
    "bitcoin",
    "india",
    "indiabitcoin",
    "buy bitcoin india",
    "bitcoin exchange india",
    "bitcoin india",
    "unocoin",
  ],
  openGraph: {
    title: "IndiaBitcoin.com — India's Bitcoin Platform",
    description:
      "India's premier Bitcoin platform. 13 years of trust. Powered by Unocoin.",
    type: "website",
    locale: "en_IN",
    siteName: "IndiaBitcoin.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "IndiaBitcoin.com — India's Bitcoin Platform",
    description:
      "India's premier Bitcoin platform. 13 years of trust. Powered by Unocoin.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain">{children}</body>
    </html>
  );
}
