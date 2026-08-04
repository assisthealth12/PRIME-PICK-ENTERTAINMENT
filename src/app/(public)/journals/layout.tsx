import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research & Journals",
  description: "Explore research papers, audience analyses, filmmaking case studies, and industry insights published by Prime Pick Entertainment.",
  alternates: {
    canonical: "/journals",
  },
};

export default function JournalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
