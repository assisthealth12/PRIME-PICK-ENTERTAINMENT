import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer 
      className="relative w-full bg-cover bg-bottom pt-10 md:pt-24 pb-6 md:pb-12" 
      style={{ backgroundImage: "url('/footer.png')" }}
    >
      <div className="container mx-auto px-5 md:px-12 flex flex-col justify-end">
        
        {/* Large Heading from Original Content */}
        <h2 className="text-white text-3xl sm:text-5xl md:text-6xl font-bold font-heading mb-6 md:mb-12 max-w-2xl leading-tight drop-shadow-md">
          Where Stories<br />Meet Perspectives
        </h2>

        <div className="flex flex-col md:flex-row justify-between w-full mt-2 gap-8 md:gap-8">
          
          {/* Left Column: Logo & Description */}
          <div className="w-full md:w-[350px] shrink-0 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 overflow-hidden rounded bg-white shrink-0">
                <Image 
                  src="/LOGO.jpg" 
                  alt="Prime Pick Logo" 
                  fill 
                  className="object-contain"
                  sizes="40px"
                  quality={100}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold tracking-widest text-white text-sm uppercase">Prime Pick</span>
                <span className="font-body text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase">Entertainment</span>
              </div>
            </Link>
            
            <p className="text-white/80 text-sm leading-relaxed">
              Empowering filmmakers through unique creative concepts, showcasing diverse perspectives and producing original stories that connect audiences.
            </p>
            
            <div className="flex flex-col gap-1 mt-2">
              <p className="text-white/60 text-xs uppercase tracking-wider">Copyright &copy; {new Date().getFullYear()} Prime Pick Entertainment</p>
            </div>
          </div>

          {/* Right Area: Links, Line, Socials */}
          <div className="flex-1 flex flex-col justify-end mt-2 md:mt-0">
            <div className="grid grid-cols-2 md:flex md:flex-row justify-start md:justify-end items-start mb-6 md:mb-12 gap-6 md:gap-24">
              
              {/* Explore Links */}
              <div>
                <h4 className="font-heading font-bold text-white tracking-[0.15em] uppercase text-xs mb-6">Explore</h4>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Films", href: "/films" },
                    { label: "Directors", href: "/directors" },
                    { label: "Challenge Series", href: "/challenges" }
                  ].map((link) => (
                    <div key={link.label} className="flex items-center gap-3">
                      <div className="h-4 w-[2px] bg-[#D4AF37]"></div>
                      <Link href={link.href} className="text-white/90 hover:text-[#D4AF37] text-sm font-medium transition-colors">
                        {link.label}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company Links */}
              <div>
                <h4 className="font-heading font-bold text-white tracking-[0.15em] uppercase text-xs mb-6">Company</h4>
                <div className="flex flex-col gap-4">
                  {/* Hardcoding links instead of map to easily set specific routes */}
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-[2px] bg-[#D4AF37]"></div>
                    <Link href="/about" className="text-white/90 hover:text-[#D4AF37] text-sm font-medium transition-colors">About Us</Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-[2px] bg-[#D4AF37]"></div>
                    <Link href="/contact" className="text-white/90 hover:text-[#D4AF37] text-sm font-medium transition-colors">Contact</Link>
                  </div>
                </div>
              </div>

            </div>

            {/* Divider Line and Socials */}
            <div className="border-t border-white/30 flex justify-start sm:justify-center md:justify-end pt-6 gap-8 md:gap-6 mt-4 md:mt-0">
              <a href="https://www.youtube.com/@PrimePickEntertainment" target="_blank" rel="noreferrer" className="text-[#D4AF37] hover:text-white transition-colors" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="https://www.instagram.com/primepick_entertainment/" target="_blank" rel="noreferrer" className="text-[#D4AF37] hover:text-white transition-colors" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="mailto:adminprimepickentertainment@gmail.com" className="text-[#D4AF37] hover:text-white transition-colors" aria-label="Email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </a>
              <a href="tel:+919611232569" className="text-[#D4AF37] hover:text-white transition-colors" aria-label="Phone">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
