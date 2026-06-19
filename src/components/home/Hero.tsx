"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ChairCanvas } from "@/components/3d/ChairCanvas";

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] py-24 mt-7 w-full flex items-center justify-center overflow-hidden bg-transparent">
      {/* 3D Background specifically for Hero */}
      <ChairCanvas />
      
      {/* Content overlay */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-4 mb-6">
          <div className="h-px w-8 bg-accent opacity-60"></div>
          <span className="font-body text-[10px] font-bold tracking-[0.35em] uppercase text-accent">
            ONE IDEA. COUNTLESS VISIONS.
          </span>
          <div className="h-px w-8 bg-accent opacity-60"></div>
        </motion.div>
        
        <motion.h1 
          variants={itemVariants}
          className="font-heading text-5xl sm:text-6xl md:text-8xl font-bold tracking-wider text-text-primary mb-4 leading-tight"
        >
          PRIME PICK<br />
          <span className="text-accent">ENTERTAINMENT</span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="font-heading text-lg sm:text-xl md:text-2xl font-medium italic text-[#222222] mb-12 tracking-wider px-4 max-w-2xl mx-auto space-y-2 drop-shadow-sm"
        >
          <span className="block">Every Story Has A Different Perspective.</span>
          <span className="block text-base sm:text-lg text-[#444444] font-normal">Original Films. Emerging Talent. Innovative Entertainment.</span>
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6">
          <Link 
            href="/films"
            className="group relative flex items-center justify-center gap-3 bg-black text-white px-8 py-4 uppercase font-heading font-bold text-xs tracking-[0.15em] transition-transform hover:-translate-y-1"
          >
            Explore Films
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link 
            href="/directors"
            className="group flex items-center justify-center gap-3 bg-white border border-black text-black px-8 py-4 uppercase font-heading font-bold text-xs tracking-[0.15em] transition-transform hover:-translate-y-1"
          >
            Our Directors
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}
