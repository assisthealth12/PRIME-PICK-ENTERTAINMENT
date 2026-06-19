import { Film, Video, Scissors, Trophy, Clapperboard, Youtube } from "lucide-react";

export function ProductionServices() {
  return (
    <section className="py-24 md:py-32 bg-surface border-t border-border-subtle relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-28">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider text-text-primary mb-6">
            Our Production Pipeline
          </h2>
          <p className="font-heading italic text-text-secondary text-xl md:text-2xl">
            A premium <strong className="text-[#D4AF37] font-normal">Film Production Company</strong> bringing the best YouTube short films to life from script to screen.
          </p>
        </div>

        {/* 3 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-32 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
          
          {/* Pre-Production */}
          <div className="flex flex-col items-center text-center group relative z-10">
            <div className="w-24 h-24 rounded-full bg-background border border-border-subtle flex items-center justify-center mb-8 group-hover:border-[#D4AF37] transition-colors duration-500 shadow-xl">
              <Film size={32} className="text-[#D4AF37]" strokeWidth={1.5} />
            </div>
            <h3 className="font-heading text-2xl font-bold tracking-widest uppercase mb-4 text-text-primary">Pre-Production</h3>
            <p className="text-text-secondary leading-relaxed text-sm">
              Script selection, rigorous casting, and detailed storyboarding. We lay the perfect foundation for new short film releases.
            </p>
          </div>

          {/* Production */}
          <div className="flex flex-col items-center text-center group relative z-10">
            <div className="w-24 h-24 rounded-full bg-background border border-border-subtle flex items-center justify-center mb-8 group-hover:border-[#D4AF37] transition-colors duration-500 shadow-xl">
              <Video size={32} className="text-[#D4AF37]" strokeWidth={1.5} />
            </div>
            <h3 className="font-heading text-2xl font-bold tracking-widest uppercase mb-4 text-text-primary">Production</h3>
            <p className="text-text-secondary leading-relaxed text-sm">
              Principal photography led by visionary creators. We specialize in producing top-tier cinematic sequences on location.
            </p>
          </div>

          {/* Post-Production */}
          <div className="flex flex-col items-center text-center group relative z-10">
            <div className="w-24 h-24 rounded-full bg-background border border-border-subtle flex items-center justify-center mb-8 group-hover:border-[#D4AF37] transition-colors duration-500 shadow-xl">
              <Scissors size={32} className="text-[#D4AF37]" strokeWidth={1.5} />
            </div>
            <h3 className="font-heading text-2xl font-bold tracking-widest uppercase mb-4 text-text-primary">Post-Production</h3>
            <p className="text-text-secondary leading-relaxed text-sm">
              Flawless editing, color grading, and immersive sound design. Bringing the final vision of the best short movies to reality.
            </p>
          </div>
        </div>

        {/* SEO Focus Area: Genres & Languages */}
        <div className="bg-background border border-border-subtle rounded-2xl p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2">
            <h3 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-6">
              Championing Regional Masterpieces
            </h3>
            <div className="space-y-4 text-text-secondary text-sm md:text-base leading-relaxed">
              <p>
                Prime Pick Entertainment is dedicated to showcasing the incredible depth of South Indian storytelling. We proudly produce and distribute <strong>Telugu short film production</strong>, <strong>Kannada short film production</strong>, and <strong>Tamil short movies</strong> that resonate with millions online.
              </p>
              <p>
                Whether it is high-tension thriller short films, engaging comedy short movies, or dramatic narratives, our goal is to consistently deliver the <strong>best YouTube short films</strong> for our audience.
              </p>
              <p>
                Through initiatives like the <strong>Directors Challenge</strong>, we invite fresh talent to step behind the camera, ensuring a steady stream of all new releases that redefine independent cinema.
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 grid grid-cols-2 gap-4 w-full">
            <div className="bg-surface border border-border-subtle p-6 rounded text-center flex flex-col items-center justify-center gap-3 hover:border-[#D4AF37]/50 transition-colors">
              <Trophy className="text-[#D4AF37]" size={28} strokeWidth={1.5} />
              <span className="font-heading font-bold text-sm tracking-widest uppercase text-text-primary">Best Telugu<br/>Short Films</span>
            </div>
            <div className="bg-surface border border-border-subtle p-6 rounded text-center flex flex-col items-center justify-center gap-3 hover:border-[#D4AF37]/50 transition-colors">
              <Clapperboard className="text-[#D4AF37]" size={28} strokeWidth={1.5} />
              <span className="font-heading font-bold text-sm tracking-widest uppercase text-text-primary">Kannada<br/>Short Movies</span>
            </div>
            <div className="bg-surface border border-border-subtle p-6 rounded text-center flex flex-col items-center justify-center gap-3 hover:border-[#D4AF37]/50 transition-colors">
              <Youtube className="text-[#D4AF37]" size={28} strokeWidth={1.5} />
              <span className="font-heading font-bold text-sm tracking-widest uppercase text-text-primary">New Releases</span>
            </div>
            <div className="bg-surface border border-border-subtle p-6 rounded text-center flex flex-col items-center justify-center gap-3 hover:border-[#D4AF37]/50 transition-colors">
              <Film className="text-[#D4AF37]" size={28} strokeWidth={1.5} />
              <span className="font-heading font-bold text-sm tracking-widest uppercase text-text-primary">Directors<br/>Challenge</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
