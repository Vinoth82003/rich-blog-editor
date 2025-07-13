// components/BlogDetails.jsx
import styles from "../styles/BlogForm.module.css";

export default function BlogDetails({ form, setForm, onNext }) {
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className={styles.formContainer}>
      <h2>Blog Info</h2>

      <label>
        Title
        <input name="title" value={form.title} onChange={handleChange} />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />
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
        Read Time (minutes)
        <input
          name="readTime"
          type="number"
          value={form.readTime}
          onChange={handleChange}
        />
      </label>

      <label>
        Status
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>

      <button onClick={onNext}>Next ➡️</button>
    </div>
  );
}
