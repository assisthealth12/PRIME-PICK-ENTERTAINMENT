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
    default: "Prime Pick Entertainment | Telugu, Kannada & Tamil Short Film Production Company",
    template: "%s | Prime Pick Entertainment",
  },
  description: "Prime Pick Entertainment is a Bangalore-based multilingual production house creating original Telugu, Kannada and Tamil short films.",
  keywords: [
    "Telugu Short Film Production Company",
    "Kannada Short Film Production Company",
    "Tamil Short Film Production Company",
    "South Indian Short Film Production House",
    "Multilingual Film Production Company",
    "Independent Film Production House India",
    "Short Film Makers in Bangalore",
    "Film Production House in Bangalore",
    "Telugu Short Film Production Company in Bangalore",
    "Kannada Short Film Production Company in Bangalore",
    "Tamil Short Film Production Company in Bangalore",
    "South Indian Film Production House in Bangalore",
    "Independent Filmmakers in Bangalore",
    "Video Production Company Bangalore",
    "Creative Production House Bengaluru",
    "Telugu Short Film Production Services",
    "Telugu Script Writing Services",
    "Telugu Casting Agency Bangalore",
    "Telugu Film Production House",
    "Kannada Short Film Production Services",
    "Kannada Script Development",
    "Kannada Casting Services",
    "Kannada Independent Film Production",
    "Tamil Short Film Production Services",
    "Tamil Script Writing Services",
    "Tamil Casting Services Bangalore",
    "Tamil Independent Film Production",
    "Best Telugu Short Film Production Company in Bangalore",
    "Affordable Kannada Short Film Production House",
    "Tamil Short Film Makers in Bangalore",
    "Multilingual Film Production Services India",
    "End-to-End Short Film Production Services",
    "Festival Ready Short Film Production Company",
    "Low Budget Short Film Production Bangalore",
    "OTT Ready Short Film Production Services",
    "Short Film Production for YouTube Creators"
  ],
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
