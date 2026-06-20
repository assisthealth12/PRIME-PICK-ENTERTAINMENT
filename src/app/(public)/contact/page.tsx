"use client";

import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ContactFormContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
        <CheckCircle2 size={64} className="text-green-500 mb-6" />
        <h3 className="text-2xl font-heading font-bold text-text-primary mb-2">Message Sent!</h3>
        <p className="text-text-secondary text-sm">
          Thank you for reaching out. We will get back to you soon.
        </p>
        <a 
          href="/contact"
          className="mt-8 border border-border-subtle px-6 py-2 text-xs font-bold uppercase tracking-widest hover:border-text-primary transition-colors inline-block"
        >
          Send Another
        </a>
      </div>
    );
  }

  return (
    <form action="https://api.web3forms.com/submit" method="POST" className="flex flex-col gap-6">
      <input type="hidden" name="access_key" value="00cbef3d-678d-49c3-a2b7-23e6eb95be30" />
      {/* Redirect back to the site after submission instead of showing Web3Forms default page */}
      <input type="hidden" name="redirect" value="https://www.primepickentertainment.com/contact?success=true" />

      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-widest text-text-secondary">Name</label>
        <input type="text" name="name" required className="bg-background border border-border-subtle rounded px-4 py-3 text-text-primary focus:border-accent outline-none transition-colors" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-widest text-text-secondary">Email</label>
        <input type="email" name="email" required className="bg-background border border-border-subtle rounded px-4 py-3 text-text-primary focus:border-accent outline-none transition-colors" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-widest text-text-secondary">Message</label>
        <textarea name="message" required rows={5} className="bg-background border border-border-subtle rounded px-4 py-3 text-text-primary focus:border-accent outline-none transition-colors resize-none"></textarea>
      </div>
      
      <button 
        type="submit" 
        className="flex items-center justify-center gap-3 bg-accent text-background uppercase tracking-[0.15em] font-bold text-xs py-4 hover:bg-accent-hover transition-colors mt-4"
      >
        Send Message
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <div className="pt-24 pb-32">
      <div className="container mx-auto px-4 md:px-8 max-w-2xl text-center">
        <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-wider text-text-primary mb-6">Contact</h1>
        <p className="font-heading italic text-text-secondary text-xl mx-auto mb-16">
          Have a script? Want to collaborate? Let's talk.<br/>
          <a href="tel:+919611232569" className="text-accent hover:underline not-italic font-bold text-2xl inline-block mt-4">+91 96112 32569</a>
        </p>
        <div className="bg-surface border border-border-subtle p-8 rounded text-left relative overflow-hidden">
          <Suspense fallback={<div className="py-12 text-center text-text-secondary">Loading form...</div>}>
            <ContactFormContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
