import { LenisProvider } from "@/components/providers/LenisProvider";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LenisProvider>
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </LenisProvider>
  );
}
