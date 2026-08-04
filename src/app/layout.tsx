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
  description: "Prime Pick Entertainment is a Bangalore-based multilingual production house creating original Telugu, Kannada and Tamil short films. We discover emerging talent through Directors Challenges, produce branded films, and publish entertainment research.",
  keywords: [
    "Prime Pick Entertainment",
    "short film production",
    "Telugu short films",
    "Kannada short films",
    "Tamil short films",
    "Bangalore production house",
    "indie filmmaking India",
    "Directors Challenge",
    "emerging filmmakers",
    "brand storytelling",
    "entertainment research",
    "multilingual short films",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.primepickentertainment.com",
    title: "Prime Pick Entertainment | Multilingual Short Film Production Company",
    description: "A Bangalore-based multilingual production house creating original Telugu, Kannada and Tamil short films. Discovering emerging talent and pushing creative boundaries.",
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
  alternates: {
    canonical: "https://www.primepickentertainment.com",
  },
};

// JSON-LD Structured Data — EntertainmentBusiness
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EntertainmentBusiness",
  "@id": "https://www.primepickentertainment.com/#organization",
  "name": "Prime Pick Entertainment",
  "alternateName": "PPE",
  "image": "https://www.primepickentertainment.com/rb.png",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.primepickentertainment.com/LOGO.jpg",
  },
  "description": "A Bangalore-based multilingual production house creating original Telugu, Kannada and Tamil short films. We discover emerging talent, produce branded films, and publish entertainment research.",
  "url": "https://www.primepickentertainment.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bangalore",
    "addressRegion": "Karnataka",
    "addressCountry": "IN"
  },
  "telephone": "+919611232569",
  "email": "info@primepickentertainment.com",
  "foundingDate": "2024",
  "knowsAbout": [
    "Short film production",
    "Telugu cinema",
    "Kannada cinema",
    "Tamil cinema",
    "Brand storytelling",
    "Entertainment research",
    "Directors Challenge"
  ],
  "sameAs": [
    "https://www.youtube.com/@PrimePickEntertainment",
    "https://www.instagram.com/primepick_entertainment/"
  ]
};

// JSON-LD Structured Data — WebSite (for AI search understanding)
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.primepickentertainment.com/#website",
  "name": "Prime Pick Entertainment",
  "url": "https://www.primepickentertainment.com",
  "publisher": {
    "@id": "https://www.primepickentertainment.com/#organization"
  },
};

// JSON-LD Structured Data — FAQPage
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Prime Pick Entertainment?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Prime Pick Entertainment is a Bangalore-based multilingual production house creating original Telugu, Kannada, and Tamil short films. We discover and nurture emerging talent in cinema and entertainment."
      }
    },
    {
      "@type": "Question",
      "name": "What services does Prime Pick Entertainment offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer short film production, the Directors Challenge program for emerging filmmakers, brand storytelling and branded films, entertainment research and audience analytics, and digital content creation."
      }
    },
    {
      "@type": "Question",
      "name": "What is the Directors Challenge?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Directors Challenge is our initiative that provides a platform for emerging filmmakers to showcase their creative vision through films made under specific creative constraints, encouraging innovation and fresh perspectives."
      }
    },
    {
      "@type": "Question",
      "name": "Where is Prime Pick Entertainment located?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Prime Pick Entertainment is based in Bangalore, Karnataka, India."
      }
    },
    {
      "@type": "Question",
      "name": "How can I contact Prime Pick Entertainment?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can reach us at +91 96112 32569 or through the contact form on our website at www.primepickentertainment.com/contact."
      }
    },
    {
      "@type": "Question",
      "name": "What languages are the films produced in?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We produce multilingual short films primarily in Telugu, Kannada, and Tamil."
      }
    },
    {
      "@type": "Question",
      "name": "Where can I watch Prime Pick Entertainment films?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our films are available on the Prime Pick Entertainment YouTube channel and can be browsed on our website at www.primepickentertainment.com/films."
      }
    },
    {
      "@type": "Question",
      "name": "Does Prime Pick Entertainment work with brands?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we collaborate with brands to create branded films, integrated storytelling, digital campaigns, and entertainment-led marketing initiatives."
      }
    }
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
        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* Website Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* FAQ Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
