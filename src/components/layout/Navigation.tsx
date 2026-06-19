"use client";

import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Home", href: "/" },
    { label: "Films", href: "/films" },
    { label: "Directors", href: "/directors" },
    { label: "Behind The Scenes", href: "/bts" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header 
        className={`sticky top-4 md:top-6 z-50 h-[72px] max-w-5xl w-[calc(100%-2rem)] mx-auto rounded-full shadow-2xl transition-all duration-500 ${
          isScrolled 
            ? "bg-[#111111]/40 backdrop-blur-md border border-white/10" 
            : "bg-[#111111] border border-[#333333]"
        }`}
      >
        <div className="container mx-auto h-full px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="relative w-40 h-16 overflow-hidden transition-transform duration-500 group-hover:scale-105">
              <Image 
                src="/rb.png" 
                alt="Prime Pick Logo" 
                fill 
                className="object-contain object-left"
                sizes="160px"
                quality={100}
                unoptimized
              />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[11px] tracking-[0.15em] uppercase transition-colors hover:text-accent ${
                  pathname === link.href 
                    ? "text-accent font-bold" 
                    : isScrolled ? "text-black font-bold" : "text-gray-400 font-medium"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button className={`${isScrolled ? "text-black" : "text-white"} hover:text-accent transition-colors`}>
              <Search size={20} strokeWidth={isScrolled ? 2.5 : 1.5} />
            </button>
            <button 
              className={`${isScrolled ? "text-black" : "text-white"} hover:text-accent transition-colors md:hidden`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} strokeWidth={isScrolled ? 2.5 : 1.5} /> : <Menu size={24} strokeWidth={isScrolled ? 2.5 : 1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[104px] z-40 bg-[#111111]/95 backdrop-blur-md md:hidden flex flex-col p-6 rounded-3xl mx-4 w-[calc(100%-2rem)] h-[calc(100vh-120px)] border border-[#333333] shadow-2xl">
          <nav className="flex flex-col gap-6 mt-8">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-heading text-2xl tracking-wider uppercase transition-colors hover:text-accent ${
                  pathname === link.href ? "text-accent" : "text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
