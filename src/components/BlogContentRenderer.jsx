"use client";
import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-json";

export default function BlogContentRenderer({ html }) {
  useEffect(() => {
    Prism.highlightAll();
  }, [html]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html.normalize("NFC") }}
      className="blog-content"
      style={{ lineHeight: 1.7, fontSize: "1.05rem" }}
    />
  );
}
