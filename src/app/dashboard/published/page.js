import DashboardLayout from "@/components/DashboardLayout";
import BlogList from "@/components/BlogList";

export default function Published() {
  return (
    <DashboardLayout>
      <BlogList filter="published" />
    </DashboardLayout>
  );
}
