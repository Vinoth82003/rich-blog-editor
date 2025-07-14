import "../styles/globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import Particles from "@/components/Particles";
import PageLoader from "@/components/PageLoader";
import ThemeToggle from "@/components/ThemeToggle";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Share Stories",
  description: "Write, draft, and publish your blog",
  keywords: "blog, writing, stories, publish, draft",
  authors: [
    {
      name: "Vinoth S",
      url: "https://vinoths.vercel.app/",
    },
  ],
  openGraph: {
    title: "Share Stories",
    description: "Write, draft, and publish your blog",
    url: "https://share-storys.vercel.app/",
    siteName: "Share Stories",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
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
