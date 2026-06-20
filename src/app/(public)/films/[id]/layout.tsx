import { Metadata, ResolvingMetadata } from "next";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface Film {
  title?: string;
  synopsis?: string;
  posterUrl?: string;
  directorName?: string;
  year?: number;
  slug?: string;
  id?: string;
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  let film: Film | null = null;

  try {
    const docRef = doc(db, "films", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      film = docSnap.data() as Film;
    } else {
      const q = query(collection(db, "films"), where("slug", "==", id));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        film = querySnapshot.docs[0].data() as Film;
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  if (!film) {
    return {
      title: "Film Not Found",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: film.title,
    description: film.synopsis || `Watch ${film.title} directed by ${film.directorName}.`,
    alternates: {
      canonical: `/films/${film.slug || id}`,
    },
    openGraph: {
      title: film.title,
      description: film.synopsis || `Watch ${film.title} directed by ${film.directorName}.`,
      images: film.posterUrl ? [film.posterUrl, ...previousImages] : previousImages,
    },
    twitter: {
      card: "summary_large_image",
      title: film.title,
      description: film.synopsis || `Watch ${film.title} directed by ${film.directorName}.`,
      images: film.posterUrl ? [film.posterUrl] : [],
    },
  };
}

export default async function FilmDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let film: Film | null = null;

  try {
    const docRef = doc(db, "films", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      film = { id: docSnap.id, ...docSnap.data() } as Film;
    } else {
      const q = query(collection(db, "films"), where("slug", "==", id));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        film = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Film;
      }
    }
  } catch (error) {
    console.error("Error fetching film for jsonld:", error);
  }

  const jsonLd = film ? {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": film.title,
    "description": film.synopsis,
    "image": film.posterUrl,
    "director": {
      "@type": "Person",
      "name": film.directorName
    },
    "dateCreated": film.year ? film.year.toString() : undefined,
    "url": `https://www.primepickentertainment.com/films/${film.slug || film.id}`
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
