import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";

interface FilmCardProps {
  film: {
    id: string;
    title: string;
    directorName: string;
    posterUrl?: string;
    genre?: string;
    year?: number;
    language?: string;
    runtime?: string;
    status?: string;
    slug?: string;
  };
}

export function FilmCard({ film }: FilmCardProps) {
  const isUpcoming = film.status === "Upcoming";
  const linkHref = `/films/${film.id}`;

  return (
    <Link href={linkHref} className="group flex flex-col">
      <div className="relative aspect-video bg-surface border border-border-subtle overflow-hidden mb-4 transition-all duration-700 hover:shadow-xl">
        {film.posterUrl ? (
          <Image 
            src={film.posterUrl}
            alt={film.title ? `${film.title} - Official Short Film Poster` : "Prime Pick Entertainment Film Poster"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#EAEAEA] to-[#D4D4D4] flex items-center justify-center p-6 text-center">
            <span className="font-heading text-lg font-bold text-text-primary opacity-30">{film.title || "Untitled"}</span>
          </div>
        )}
        
        {/* Upcoming Overlay */}
        {isUpcoming && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-[9px] font-bold tracking-[0.2em] uppercase text-text-primary border border-black/10">
            Coming Soon
          </div>
        )}
        
        {/* Hover State Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-500 flex items-center justify-center group-hover:opacity-100">
          {!isUpcoming && (
            <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur border border-white text-black flex items-center justify-center transition-transform duration-500 scale-90 group-hover:scale-100 shadow-xl">
              <Play size={24} fill="currentColor" className="ml-1" />
            </div>
          )}
        </div>
      </div>
      
      {/* Editorial Meta */}
      <div className="flex flex-col">
        <h3 className="font-heading text-xl md:text-2xl font-bold text-text-primary mb-1 line-clamp-2 leading-tight">
          {film.title}
        </h3>
        <p className="text-text-secondary text-xs uppercase tracking-widest font-medium mb-2">
          Dir. {film.directorName}
        </p>
        
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-text-secondary uppercase tracking-widest mt-1">
          {film.year && <span>{film.year}</span>}
          {film.year && (film.genre || film.runtime) && <span>/</span>}
          {film.genre && <span>{film.genre}</span>}
          {film.genre && film.runtime && <span>/</span>}
          {film.runtime && <span>{film.runtime}</span>}
        </div>
      </div>
    </Link>
  );
}
