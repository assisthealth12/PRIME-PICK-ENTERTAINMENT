import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Challenge Series",
  description: "Explore the Directors Challenge — films born from intense creative constraints. Watch emerging filmmakers push boundaries in timed challenges at Prime Pick Entertainment.",
  alternates: {
    canonical: "/challenges",
  },
};

export default function ChallengesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
