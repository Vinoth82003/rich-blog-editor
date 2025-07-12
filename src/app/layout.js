import "../styles/globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import Particles from "@/components/Particles";
import PageLoader from "@/components/PageLoader";
import ThemeToggle from "@/components/ThemeToggle";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "My Blog App",
  description: "Write, draft, and publish your blog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Particles />
        <PageLoader />
        <Toaster position="top-center" />
        <ThemeProvider>
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
