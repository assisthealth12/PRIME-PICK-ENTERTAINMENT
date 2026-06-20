import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Behind The Scenes",
  description: "Discover the magic behind the lens and how we bring our original stories to life at Prime Pick Entertainment.",
  alternates: {
    canonical: "/bts",
  },
};

export default function BTSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
