import { Hero } from "@/components/home/Hero";
import { FeaturedFilms } from "@/components/home/FeaturedFilms";
import { ProductionServices } from "@/components/home/ProductionServices";
import { DirectorsHighlight } from "@/components/home/DirectorsHighlight";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <ProductionServices />
      <FeaturedFilms />
      <DirectorsHighlight />
    </div>
  );
}
