import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
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
    default: "Prime Pick Entertainment | Telugu, Kannada & Tamil Short Film Production Company",
    template: "%s | Prime Pick Entertainment",
  },
  description: "Prime Pick Entertainment is a Bangalore-based multilingual production house creating original Telugu, Kannada and Tamil short films.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.primepickentertainment.com",
    title: "Prime Pick Entertainment | Multilingual Short Film Production Company",
    description: "A Bangalore-based multilingual production house creating original Telugu, Kannada and Tamil short films.",
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
    title: "Prime Pick Entertainment | Multilingual Short Film Production Company",
    description: "A Bangalore-based multilingual production house creating original Telugu, Kannada and Tamil short films.",
    images: ["/rb.png"],
  },
  icons: {
    icon: "/rb.png",
    apple: "/rb.png",
  },
  verification: {
    google: "WUBbTqGlNeBpVioxLNqfAKUTv49W76epHYW6cdwAUQw",
  },
};

// JSON-LD Structured Data for Google Knowledge Panel
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EntertainmentBusiness",
  "name": "Prime Pick Entertainment",
  "image": "https://www.primepickentertainment.com/rb.png",
  "description": "A Bangalore-based multilingual production house creating original Telugu, Kannada and Tamil short films.",
  "url": "https://www.primepickentertainment.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bangalore",
    "addressRegion": "Karnataka",
    "addressCountry": "IN"
  },
  "telephone": "+919611232569",
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
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-EGW8W4GC7J`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-EGW8W4GC7J');
            `,
          }}
        />
      </head>
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
