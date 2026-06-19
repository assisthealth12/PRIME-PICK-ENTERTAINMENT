import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.primepickentertainment.com"),
  title: {
    default: "Prime Pick Entertainment | Independent Cinema Platform",
    template: "%s | Prime Pick Entertainment",
  },
  description: "A premium YouTube-first film production house in Bangalore that discovers directors, produces independent films, and showcases cinematic storytelling.",
  keywords: ["Film Production Bangalore", "Independent Cinema India", "Prime Pick Entertainment", "Short Films", "Directors", "YouTube Films"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.primepickentertainment.com",
    title: "Prime Pick Entertainment",
    description: "A premium YouTube-first film production house in Bangalore discovering the next generation of visionary directors.",
    siteName: "Prime Pick Entertainment",
    images: [
      {
        url: "/rb.png",
        width: 800,
        height: 600,
        alt: "Prime Pick Entertainment Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime Pick Entertainment",
    description: "India's Independent Cinema Platform. Discovering directors and producing premium short films.",
    images: ["/rb.png"],
  },
  icons: {
    icon: "/rb.png",
    apple: "/rb.png",
  },
};

// JSON-LD Structured Data for Google Knowledge Panel
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EntertainmentBusiness",
  "name": "Prime Pick Entertainment",
  "image": "https://www.primepickentertainment.com/rb.png",
  "description": "A premium YouTube-first film production house that discovers directors, produces independent films, and showcases cinematic storytelling.",
  "url": "https://www.primepickentertainment.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bangalore",
    "addressRegion": "Karnataka",
    "addressCountry": "IN"
  },
  "sameAs": [
    "https://www.youtube.com/@PrimePickEntertainment",
    "https://www.instagram.com/primepick_entertainment/"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} antialiased bg-background text-text-primary`}
    >
      <body className="min-h-screen flex flex-col">
        {/* Injecting Structured Data into the DOM */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
