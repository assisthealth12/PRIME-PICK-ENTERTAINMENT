import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Library",
  description: "Browse our curated collection of independent cinema, including original Telugu, Kannada and Tamil short films.",
  alternates: {
    canonical: "/films",
  },
};

export default function FilmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
