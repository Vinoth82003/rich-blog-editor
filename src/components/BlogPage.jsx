"use client";
import { useEffect, useState } from "react";
import { shouldTrackView } from "../../utils/viewTracker";

function BlogStats({ slug }) {
  const [views, setViews] = useState(null);

  useEffect(() => {
    if (shouldTrackView(slug)) {
      fetch(`/api/blogs/slug/${slug}/view`, {
        method: "POST",
      }).catch(console.error);
    }
  }, [slug]);

  useEffect(() => {
    fetch(`/api/blogs/slug/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.views !== undefined) setViews(data.views);
      });
  }, [slug]);

  return (
    <p style={{ fontSize: "0.9rem", color: "#888" }}>
      {views !== null ? `${views.toLocaleString()} views` : "Loading views..."}
    </p>
  );
}

export default BlogStats;
