import { ArrowRight } from "lucide-react";
import { useState } from "react";
import styles from "../styles/BlogForm.module.css";

export default function BlogDetails({ form, setForm, onNext }) {
  const [errors, setErrors] = useState({});
  const [showSeo, setShowSeo] = useState(false); // toggle SEO section

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleNext = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (!form.readTime || Number(form.readTime) <= 0)
      newErrors.readTime = "Enter a valid read time";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

  return (
    <div className={styles.formContainer}>
      <h2>📝 Blog Info</h2>

      {/* Basic Blog Fields */}
      <label>
        Title <span className={styles.required}>*</span>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className={errors.title ? styles.errorInput : ""}
        />
        {errors.title && <p className={styles.errorText}>{errors.title}</p>}
      </label>

      <label>
        Description <span className={styles.required}>*</span>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className={errors.description ? styles.errorInput : ""}
        />
        {errors.description && (
          <p className={styles.errorText}>{errors.description}</p>
        )}
      </label>

      <label>
        Banner Image URL
        <input
          name="bannerUrl"
          value={form.bannerUrl}
          onChange={handleChange}
        />
      </label>

      <label>
        Read Time (minutes) <span className={styles.required}>*</span>
        <input
          name="readTime"
          type="number"
          value={form.readTime}
          onChange={handleChange}
          className={errors.readTime ? styles.errorInput : ""}
        />
        {errors.readTime && (
          <p className={styles.errorText}>{errors.readTime}</p>
        )}
      </label>

      <label>
        Status
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>

      {/* SEO Section */}
      <div className={styles.seoSection}>
        <button
          type="button"
          className={styles.toggleSeoBtn}
          onClick={() => setShowSeo(!showSeo)}
        >
          {showSeo ? "▼ Hide SEO Metadata" : "▶ Show SEO Metadata"}
        </button>

        {showSeo && (
          <div className={styles.seoFields}>
            <h3>🔍 SEO Metadata</h3>

            <label>
              Slug (URL path)
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="my-awesome-blog-post"
              />
            </label>

            <label>
              Meta Title
              <input
                name="metaTitle"
                value={form.metaTitle}
                onChange={handleChange}
                placeholder="Best Waffle Coffee Cups in 2025"
              />
            </label>

            <label>
              Meta Description
              <textarea
                name="metaDescription"
                value={form.metaDescription}
                onChange={handleChange}
                placeholder="A short summary for search engines..."
              />
            </label>

            <label>
              Meta Keywords (comma separated)
              <input
                name="metaKeywords"
                value={form.metaKeywords}
                onChange={handleChange}
                placeholder="waffle cups, edible coffee cups, eco friendly"
              />
            </label>

            <label>
              Canonical URL
              <input
                name="canonicalUrl"
                value={form.canonicalUrl}
                onChange={handleChange}
                placeholder="https://example.com/blog/my-awesome-post"
              />
            </label>
          </div>
        )}
      </div>

      <button onClick={handleNext} className={styles.nextBtn}>
        Next <ArrowRight size={16} />
      </button>
    </div>
  );
}
