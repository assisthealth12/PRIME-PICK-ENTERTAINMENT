import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  // Base metadata fallback
  let coverImage = "";

  try {
    // Fetch directly from Firestore REST API (no Firebase Admin needed)
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/prime-pick-entertainment/databases/(default)/documents/journals/${id}`,
      { next: { revalidate: 3600 } }
    );

    if (res.ok) {
      const data = await res.json();
      
      if (data.fields?.coverImage?.stringValue) {
        coverImage = data.fields.coverImage.stringValue;
      }
    }
  } catch (error) {
    console.error("Error fetching journal metadata:", error);
  }

  return {
    openGraph: {
      images: coverImage
        ? [{ url: coverImage, width: 1200, height: 630 }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      images: coverImage ? [coverImage] : [],
    },
  };
}

export default function JournalDetailLayout({ children }: Props) {
  return <>{children}</>;
}
