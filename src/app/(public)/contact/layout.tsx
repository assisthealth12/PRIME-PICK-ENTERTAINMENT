import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Have a script? Want to collaborate? Let's talk. Contact Prime Pick Entertainment for collaborations, productions, and inquiries.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
