import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Directors",
  description: "Meet the independent voices and talented filmmakers shaping the future of Indian storytelling at Prime Pick Entertainment.",
  alternates: {
    canonical: "/directors",
  },
};

export default function DirectorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
