"use client";
import { useState, useRef } from "react";
import { ArrowRight, ImagePlus, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import styles from "../styles/BlogForm.module.css";
import toast from "react-hot-toast";

export default function BlogDetails({ form, setForm, onNext, showMetadata = true }) {
  const [errors, setErrors] = useState({});
  const [showSeo, setShowSeo] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(form.bannerUrl || "");
  const [uploadedImageData, setUploadedImageData] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "bannerUrl") {
      setBannerPreview(value);
      if (uploadedImageData) setUploadedImageData(null);
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, WEBP, or GIF images are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    const toastId = toast.loading("Uploading banner...");

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Upload to ImgBB
      const formData = new FormData();
      formData.append("image", file);
      const apiKey = '5211b2cf516cac1af99ded9c6c78e096';

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        const imageUrl = data.data.url;
        setForm({ ...form, bannerUrl: imageUrl });
        setBannerPreview(imageUrl);
        setUploadedImageData({
          id: data.data.id,
          deleteUrl: data.data.delete_url, // ImgBB provides this but it requires manual user visit
          url: imageUrl
        });
        toast.success("Banner uploaded!");
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.message || "Failed to upload banner");
      setBannerPreview("");
    } finally {
      toast.dismiss(toastId);
      e.target.value = '';
    }
  };

  const handleRemoveBanner = async () => {
    if (!uploadedImageData) {
      // If no image was uploaded (just a URL), just remove it
      setBannerPreview("");
      setForm({ ...form, bannerUrl: "" });
      return;
    }

    setIsRemoving(true);
    const toastId = toast.loading("Removing banner...");

    try {

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Banner removed from our system");

      // Clear the banner
      setBannerPreview("");
      setForm({ ...form, bannerUrl: "" });
      setUploadedImageData(null);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.message || "Failed to remove banner");
    } finally {
      toast.dismiss(toastId);
      setIsRemoving(false);
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
      <h2>Blog Info</h2>

      {/* Banner Preview */}
      {bannerPreview && (
        <div className={styles.bannerPreview}>
          <img
            src={bannerPreview}
            alt="Banner preview"
            width={800}
            height={400}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '300px',
              objectFit: 'cover',
              borderRadius: '8px',
              border: '1px solid var(--border-mid)'
            }}
            onError={() => {
              setBannerPreview("");
              toast.error("Failed to load banner image");
            }}
          />
          <button
            className={styles.removeBanner}
            onClick={handleRemoveBanner}
            disabled={isRemoving}
          >
            {isRemoving ? (
              'Removing...'
            ) : (
              <>
                <Trash2 size={16} /> Remove Banner
              </>
            )}
          </button>
          {uploadedImageData?.deleteUrl && (
            <div className={styles.deleteNote}>
              Note: To permanently delete from ImgBB, <a href={uploadedImageData.deleteUrl} target="_blank" rel="noopener noreferrer">visit this link</a>
            </div>
          )}
        </div>
      )}

      {/* Banner URL Input */}
      <label>
        Banner Image
        <div className={styles.bannerInputGroup}>
          <input
            name="bannerUrl"
            value={form.bannerUrl}
            onChange={handleChange}
            placeholder="Enter image URL or upload"
            disabled={isRemoving}
          />
          <button
            type="button"
            className={styles.uploadButton}
            onClick={() => fileInputRef.current?.click()}
            disabled={isRemoving}
          >
            <ImagePlus size={18} />
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className={styles.uploadInput}
            hidden
            onChange={handleImageUpload}
            disabled={isRemoving}
          />
        </div>
      </label>

      <label>
        Title <span className={styles.required}>*</span>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className={errors.title ? styles.errorInput : ""}
          disabled={isRemoving}
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
          rows={4}
          disabled={isRemoving}
        />
        {errors.description && (
          <p className={styles.errorText}>{errors.description}</p>
        )}
      </label>

      <div className={styles.twoColumn}>
        <label>
          Read Time (minutes) <span className={styles.required}>*</span>
          <input
            name="readTime"
            type="number"
            min="1"
            value={form.readTime}
            onChange={handleChange}
            className={errors.readTime ? styles.errorInput : ""}
            disabled={isRemoving}
          />
          {errors.readTime && (
            <p className={styles.errorText}>{errors.readTime}</p>
          )}
        </label>

        <label>
          Status
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={isRemoving}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            {/* <option value="archived">Archived</option> */}
          </select>
        </label>
      </div>

      <label>
        Published Date
        <input
          type="date"
          name="publishedDate" 
          value={form.publishedDate}
          onChange={handleChange}
          className={errors.publishedDate ? styles.errorInput : ""}
          disabled={isRemoving}
        />
      </label>


      {showMetadata && (
        <div className={styles.seoSection}>
          <button
            type="button"
            className={styles.toggleSeoBtn}
            onClick={() => setShowSeo(!showSeo)}
            disabled={isRemoving}
          >
            {showSeo ? (
              <>
                <ChevronUp size={16} /> Hide SEO Settings
              </>
            ) : (
              <>
                <ChevronDown size={16} /> Show SEO Settings
              </>
            )}
          </button>

          {showSeo && (
            <div className={styles.seoFields}>
              <h3>SEO Metadata</h3>

              <label>
                Slug (URL path)
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="my-awesome-blog-post"
                  disabled={isRemoving}
                />
              </label>

              <label>
                Meta Title
                <input
                  name="metaTitle"
                  value={form.metaTitle}
                  onChange={handleChange}
                  placeholder="Best Blog Post in 2025"
                  disabled={isRemoving}
                />
              </label>

              <label>
                Meta Description
                <textarea
                  name="metaDescription"
                  value={form.metaDescription}
                  onChange={handleChange}
                  placeholder="A short summary for search engines..."
                  rows={3}
                  disabled={isRemoving}
                />
              </label>

              <label>
                Meta Keywords (comma separated)
                <input
                  name="metaKeywords"
                  value={form.metaKeywords}
                  onChange={handleChange}
                  placeholder="blog, tutorial, web development"
                  disabled={isRemoving}
                />
              </label>

              <label>
                Canonical URL
                <input
                  name="canonicalUrl"
                  value={form.canonicalUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/blog/my-post"
                  disabled={isRemoving}
                />
              </label>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleNext}
        className={styles.nextBtn}
        disabled={isRemoving}
      >
        Next <ArrowRight size={16} />
      </button>
    </div>
  );
}