import DashboardLayout from "@/components/DashboardLayout";
import BlogForm from "@/components/BlogForm";

export default function Edit({ params }) {
  return (
    <DashboardLayout>
      <BlogForm blogId={params.id} />
    </DashboardLayout>
  );
}
