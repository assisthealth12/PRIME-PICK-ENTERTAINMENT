import { Hero } from "@/components/home/Hero";
import { FeaturedFilms } from "@/components/home/FeaturedFilms";
import { DirectorsHighlight } from "@/components/home/DirectorsHighlight";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Prime Pick Entertainment is a Bangalore-based multilingual production house creating original Telugu, Kannada and Tamil short films.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeaturedFilms />
      <DirectorsHighlight />
    </div>
  );
}
