import "../styles/globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import Particles from "@/components/Particles";
import PageLoader from "@/components/PageLoader";
import ThemeToggle from "@/components/ThemeToggle";

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

        <ThemeProvider>
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
