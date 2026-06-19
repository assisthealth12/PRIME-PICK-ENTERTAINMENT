export default function AboutPage() {
  return (
    <div className="pt-24 pb-32 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <header className="mb-16 md:mb-24 text-center">
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider text-text-primary mb-6 uppercase leading-tight">
            Prime Pick <br className="hidden md:block" /> Entertainment
          </h1>
          <p className="font-heading italic text-accent text-xl md:text-2xl mx-auto mb-12">
            Where Stories Meet Perspectives.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          
          {/* Main Body */}
          <div className="md:col-span-8 text-text-primary leading-[1.8] text-[15px] md:text-base space-y-6">
            <p className="font-medium text-lg leading-relaxed text-black">
              Prime Pick Entertainment is a creative platform dedicated to discovering, nurturing, and showcasing emerging talent in cinema and entertainment.
            </p>
            <p>
              We believe great stories deserve great opportunities. Our mission is to identify promising directors, writers, actors, cinematographers, editors, musicians, and technicians, provide them with guidance and creative support, and help transform original ideas into compelling entertainment experiences.
            </p>
            <p>
              Every project produced under Prime Pick Entertainment is original. We encourage fresh perspectives, innovative storytelling, and creative experimentation that challenge conventional approaches to filmmaking. Through initiatives such as the Directors Challenge, we create opportunities for filmmakers to showcase their unique vision and demonstrate the power of storytelling through diverse perspectives.
            </p>
            <p>
              We also develop innovative entertainment formats, reality concepts, and original digital content designed to engage audiences and push creative boundaries.
            </p>
            <p>
              Beyond content creation, we are committed to understanding the art and science of entertainment. We analyze audience engagement, study content performance, document creative outcomes, and publish insights that contribute to filmmaking knowledge and entertainment research.
            </p>
            <p>
              Our productions are showcased through the Prime Pick Entertainment YouTube Channel, creating visibility for emerging creators while building a community that celebrates original storytelling. We also collaborate with brands to create meaningful and engaging content through branded films, integrated storytelling, digital campaigns, and entertainment-led marketing initiatives.
            </p>
            <p className="font-heading text-2xl italic text-text-primary pt-6 border-t border-border-subtle mt-10">
              Prime Pick Entertainment is more than a content platform. It is an ecosystem where talent is discovered, creativity is nurtured, original stories are celebrated, and the future of entertainment is shaped.
            </p>
          </div>

          {/* Sidebar Pillars */}
          <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-border-subtle pt-10 md:pt-0 md:pl-10 space-y-10">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3">Discover Talent</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Identifying and nurturing emerging directors, writers, actors, and technicians.</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3">Produce Original Content</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Creating short films, digital series, reality concepts, and entertainment formats.</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3">Directors Challenge</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Providing a platform for filmmakers to showcase their creative vision.</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3">Entertainment Research</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Analyzing audience engagement and publishing filmmaking insights and case studies.</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3">Brand Storytelling</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Creating branded films, integrated content, and entertainment-driven marketing campaigns.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
