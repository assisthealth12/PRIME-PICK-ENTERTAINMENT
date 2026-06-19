import { Hero } from "@/components/home/Hero";
import { FeaturedFilms } from "@/components/home/FeaturedFilms";
import { DirectorsHighlight } from "@/components/home/DirectorsHighlight";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeaturedFilms />
      <DirectorsHighlight />
    </div>
  );
}
