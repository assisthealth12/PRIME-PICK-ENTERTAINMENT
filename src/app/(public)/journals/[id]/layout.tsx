import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params;
  
  // Base metadata fallback
  let title = "Journal | Prime Pick Entertainment";
  let description = "Read this research journal from Prime Pick Entertainment.";
  let coverImage = "";

  try {
    // Fetch directly from Firestore REST API to avoid initializing Firebase Admin on the server
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/prime-pick-entertainment/databases/(default)/documents/journals/${id}`, {
      next: { revalidate: 3600 } // Cache for 1 hour to keep it fast, but allow updates
    });

    if (res.ok) {
      const data = await res.json();
      
      if (data.fields) {
        if (data.fields.title?.stringValue) {
          title = data.fields.title.stringValue;
        }
        if (data.fields.abstract?.stringValue) {
          description = data.fields.abstract.stringValue;
        }
        if (data.fields.coverImage?.stringValue) {
          coverImage = data.fields.coverImage.stringValue;
        }
      }
    }
  } catch (error) {
    console.error("Error fetching journal metadata:", error);
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: coverImage ? [{ url: coverImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: coverImage ? [coverImage] : [],
    },
  };
}

export default function JournalDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
