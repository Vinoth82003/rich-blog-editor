"use client";

import styles from "@/styles/BlogTable.module.css";
import Spinner from "./Spinner";

export default function BlogTable({ blogs }) {
  //   const [blogs, setBlogs] = useState([]);

  if (!blogs) return <Spinner />;
  if (blogs.length === 0)
    return (
      <div className={styles.emptyState}>
        <h3>No blogs found</h3>
        <p>Start writing your first blog!</p>
      </div>
    );

  return (
    <div className={styles.tableWrapper}>
      <h3 className={styles.heading}>📝 Your Blogs</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Created</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id}>
              <td>{blog.title}</td>
              <td>
                <span
                  className={`${styles.badge} ${
                    blog.status === "published"
                      ? styles.published
                      : styles.draft
                  }`}
                >
                  {blog.status}
                </span>
              </td>
              <td>{new Date(blog.createdAt).toLocaleString()}</td>
              <td>{new Date(blog.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
