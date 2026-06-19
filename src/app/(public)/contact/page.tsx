"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { submitContactForm } from "@/app/actions/contact";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    
    // We send data to our own secure Server Action instead of the external URL
    const formData = new FormData(event.currentTarget);

    try {
      const data = await submitContactForm(formData);
      
      if (data.success) {
        setStatus("success");
        event.currentTarget.reset();
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="pt-24 pb-32">
      <div className="container mx-auto px-4 md:px-8 max-w-2xl text-center">
        <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-wider text-text-primary mb-6">Contact</h1>
        <p className="font-heading italic text-text-secondary text-xl mx-auto mb-16">
          Have a script? Want to collaborate? Let's talk.
        </p>
        <div className="bg-surface border border-border-subtle p-8 rounded text-left relative overflow-hidden">
          
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
              <CheckCircle2 size={64} className="text-green-500 mb-6" />
              <h3 className="text-2xl font-heading font-bold text-text-primary mb-2">Message Sent!</h3>
              <p className="text-text-secondary text-sm">
                Thank you for reaching out. We will get back to you soon.
              </p>
              <button 
                onClick={() => setStatus("idle")}
                className="mt-8 border border-border-subtle px-6 py-2 text-xs font-bold uppercase tracking-widest hover:border-text-primary transition-colors"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
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
              
              {status === "error" && (
                <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === "submitting"}
                className="flex items-center justify-center gap-3 bg-accent text-background uppercase tracking-[0.15em] font-bold text-xs py-4 hover:bg-accent-hover transition-colors mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
