import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  let coverImage = "";
  let title = "Journal | Prime Pick Entertainment";
  let shortDescription = "Research journal by Prime Pick Entertainment.";

  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/prime-pick-entertainment/databases/(default)/documents/journals/${id}`,
      { next: { revalidate: 3600 } }
    );

    if (res.ok) {
      const data = await res.json();
      const fields = data.fields;

      if (fields?.coverImage?.stringValue) {
        coverImage = fields.coverImage.stringValue;
      }
      if (fields?.title?.stringValue) {
        // Truncate to ~55 chars for social platforms
        const raw = fields.title.stringValue;
        title = raw.length > 55 ? raw.slice(0, 55).trim() + "…" : raw;
      }
      if (fields?.abstract?.stringValue) {
        // Truncate to ~120 chars for social previews
        const raw = fields.abstract.stringValue;
        shortDescription = raw.length > 120 ? raw.slice(0, 120).trim() + "…" : raw;
      }
    }
  } catch (error) {
    console.error("Error fetching journal metadata:", error);
  }

  const pageUrl = `https://www.primepickentertainment.com/journals/${id}`;

  return {
    title,
    description: shortDescription,
    openGraph: {
      title,
      description: shortDescription,
      url: pageUrl,
      siteName: "Prime Pick Entertainment",
      type: "article",
      images: coverImage
        ? [{ url: coverImage, width: 1200, height: 630, alt: title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: shortDescription,
      images: coverImage ? [coverImage] : [],
    },
  };
}

export default function JournalDetailLayout({ children }: Props) {
  return <>{children}</>;
}
