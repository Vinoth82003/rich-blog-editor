import DashboardLayout from "@/components/DashboardLayout";
import BlogList from "@/components/BlogList";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h1>Welcome back 👋</h1>
      
      <BlogList />
    </DashboardLayout>
  );
}
