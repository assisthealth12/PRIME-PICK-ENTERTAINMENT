"use client";

import Link from "next/link";
import { Search, Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle escape key to close search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/films?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

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
            <button 
              className={`${isScrolled ? "text-black" : "text-white"} hover:text-accent transition-colors`}
              onClick={() => setIsSearchOpen(true)}
            >
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

      {/* Search Fullscreen Overlay */}
      <div 
        className={`fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl transition-all duration-500 flex flex-col items-center justify-center px-4 ${
          isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <button 
          onClick={() => setIsSearchOpen(false)}
          className="absolute top-8 right-8 p-4 text-text-secondary hover:text-white transition-colors hover:rotate-90 duration-300"
        >
          <X size={32} strokeWidth={1} />
        </button>

        <div className="w-full max-w-3xl transform transition-transform duration-500 delay-100" style={{ transform: isSearchOpen ? 'translateY(0)' : 'translateY(20px)' }}>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-8 text-center tracking-wider">
            What are you looking for?
          </h2>
          
          <form onSubmit={handleSearchSubmit} className="relative group">
            <input 
              ref={searchInputRef}
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search films, directors, genres..." 
              className="w-full bg-transparent border-b-2 border-[#333] py-4 md:py-6 pl-4 md:pl-8 pr-16 text-xl md:text-3xl text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-colors"
            />
            <button 
              type="submit" 
              className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-gray-500 group-focus-within:text-accent hover:text-accent transition-colors"
            >
              <ArrowRight size={32} strokeWidth={1.5} />
            </button>
          </form>
          
          <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm font-heading tracking-widest uppercase text-gray-500">
            <span className="hidden md:inline">Popular:</span>
            <button onClick={() => { setSearchQuery("Telugu"); handleSearchSubmit(new Event('submit') as any); }} className="hover:text-accent transition-colors">Telugu</button>
            <span className="text-[#333]">•</span>
            <button onClick={() => { setSearchQuery("Kannada"); handleSearchSubmit(new Event('submit') as any); }} className="hover:text-accent transition-colors">Kannada</button>
            <span className="text-[#333]">•</span>
            <button onClick={() => { setSearchQuery("Comedy"); handleSearchSubmit(new Event('submit') as any); }} className="hover:text-accent transition-colors">Comedy</button>
            <span className="text-[#333]">•</span>
            <button onClick={() => { setSearchQuery("Thriller"); handleSearchSubmit(new Event('submit') as any); }} className="hover:text-accent transition-colors">Thriller</button>
          </div>
        </div>
      </div>
    </>
  );
}
