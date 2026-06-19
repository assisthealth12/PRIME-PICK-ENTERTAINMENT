export default function ContactPage() {
  return (
    <div className="pt-24 pb-32">
      <div className="container mx-auto px-4 md:px-8 max-w-2xl text-center">
        <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-wider text-text-primary mb-6">Contact</h1>
        <p className="font-heading italic text-text-secondary text-xl mx-auto mb-16">
          Have a script? Want to collaborate? Let's talk.
        </p>
        <div className="bg-surface border border-border-subtle p-8 rounded text-left">
          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-text-secondary">Name</label>
              <input type="text" className="bg-background border border-border-subtle rounded px-4 py-3 text-text-primary focus:border-accent outline-none transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-text-secondary">Email</label>
              <input type="email" className="bg-background border border-border-subtle rounded px-4 py-3 text-text-primary focus:border-accent outline-none transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-text-secondary">Message</label>
              <textarea rows={5} className="bg-background border border-border-subtle rounded px-4 py-3 text-text-primary focus:border-accent outline-none transition-colors resize-none"></textarea>
            </div>
            <button className="bg-accent text-background uppercase tracking-[0.15em] font-bold text-xs py-4 hover:bg-accent-hover transition-colors mt-4">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
