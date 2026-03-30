import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unocoin — Bringing Bitcoin to Billions",
  description:
    "India's pioneer Bitcoin platform. 13 years of trust, innovation, and building the future of money. Buy, sell, and hold Bitcoin with India's most trusted exchange.",
  keywords: [
    "bitcoin",
    "india",
    "cryptocurrency",
    "unocoin",
    "buy bitcoin india",
    "crypto exchange",
    "bitcoin exchange india",
  ],
  openGraph: {
    title: "Unocoin — Bringing Bitcoin to Billions",
    description:
      "India's pioneer Bitcoin platform. 13 years of trust, innovation, and building the future of money.",
    type: "website",
    locale: "en_IN",
    siteName: "Unocoin",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unocoin — Bringing Bitcoin to Billions",
    description:
      "India's pioneer Bitcoin platform. 13 years of trust, innovation, and building the future of money.",
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
