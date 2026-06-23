"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { motion } from "framer-motion";
import Image from "next/image";

interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
}

export function BrandMarquee() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const q = query(collection(db, "brands"), orderBy("order", "asc"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const fetchedBrands = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Brand[];
        
        setBrands(fetchedBrands);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's 'md' breakpoint is 768px
    };
    
    // Check initially and on resize
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (brands.length === 0) return null;

  const shouldScroll = isMobile ? brands.length > 1 : brands.length > 4;
  const displayBrands = shouldScroll ? [...brands, ...brands, ...brands, ...brands] : brands;

  return (
    <section className="bg-white py-16 border-t-2 border-b-2 border-black overflow-hidden relative">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-center text-xs font-black uppercase tracking-[0.2em] text-gray-400">
          In Collaboration With
        </h2>
      </div>

      <div className="relative w-full flex items-center justify-center overflow-hidden min-h-[6rem]">
        {shouldScroll && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          </>
        )}

        <motion.div
          className={`flex items-center ${shouldScroll ? "whitespace-nowrap w-max" : "flex-wrap justify-center gap-8 md:gap-16"}`}
          animate={shouldScroll ? { x: ["0%", "-50%"] } : { x: 0 }}
          transition={shouldScroll ? {
            ease: "linear",
            duration: Math.max(20, brands.length * 5), // Adjust speed based on number of brands
            repeat: Infinity,
          } : {}}
        >
          {displayBrands.map((brand, i) => (
            <div
              key={`${brand.id}-${i}`}
              className={`${shouldScroll ? "mx-8 md:mx-16" : ""} flex-shrink-0`}
            >
              {brand.websiteUrl ? (
                <a 
                  href={brand.websiteUrl} 
                  target="_blank" 
                  rel="noopener" 
                  title={`Visit ${brand.name} - Official Partner of Prime Pick Entertainment`}
                  aria-label={`Visit the official website of ${brand.name}`}
                  className="block relative h-12 w-32 md:w-40 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                >
                  <Image
                    src={brand.logoUrl}
                    alt={`${brand.name} logo - Prime Pick Entertainment Brand Partner`}
                    width={160}
                    height={48}
                    className="object-contain w-full h-full max-h-12"
                  />
                </a>
              ) : (
                <div 
                  className="relative h-12 w-32 md:w-40 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                  title={`${brand.name} - Brand Partner`}
                >
                  <Image
                    src={brand.logoUrl}
                    alt={`${brand.name} logo - Prime Pick Entertainment Brand Partner`}
                    width={160}
                    height={48}
                    className="object-contain w-full h-full max-h-12"
                  />
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
