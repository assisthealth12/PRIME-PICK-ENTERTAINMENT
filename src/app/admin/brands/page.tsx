import { ManageBrands } from "@/components/admin/ManageBrands";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Brands",
};

export default function AdminBrandsPage() {
  return <ManageBrands />;
}
