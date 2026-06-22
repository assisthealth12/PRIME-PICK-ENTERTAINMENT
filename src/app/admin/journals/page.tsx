import { ManageJournals } from "@/components/admin/ManageJournals";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Journals",
};

export default function AdminJournalsPage() {
  return <ManageJournals />;
}
