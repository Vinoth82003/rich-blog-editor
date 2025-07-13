import {
  Bold,
  Italic,
  Underline,
  Heading,
  List,
  ListOrdered,
  Strikethrough,
  Code2,
  Image,
  Youtube,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Minus,
} from "lucide-react";
import styles from "../styles/Toolbar.module.css";

export default function Toolbar({ editor, fileInputRef }) {
  if (!editor) return null;

  const isActive = (name, opts) => editor.isActive(name, opts);

  return (
    <div className={styles.toolbar}>
      <button
        className={isActive("bold") ? styles.active : ""}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </button>
      <button
        className={isActive("italic") ? styles.active : ""}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </button>
      <button
        className={isActive("underline") ? styles.active : ""}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline size={16} />
      </button>
      <button
        className={isActive("strike") ? styles.active : ""}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={16} />
      </button>
      <button
        className={isActive("heading", { level: 2 }) ? styles.active : ""}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={16} />
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Code2 size={16} />
      </button>

      <button
        onClick={() => {
          const url = prompt("Enter image URL");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
      >
        <Image size={16} />
      </button>
      <button onClick={() => fileInputRef.current?.click()}>
        <Image size={16} style={{ opacity: 0.6 }} />
      </button>

      <button
        onClick={() => {
          const url = prompt("YouTube URL");
          if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
        }}
      >
        <Youtube size={16} />
      </button>

      <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        <AlignLeft size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight size={16} />
      </button>

      <select
        onChange={(e) =>
          editor.chain().focus().setFontSize(e.target.value).run()
        }
        defaultValue=""
        className={styles.fontSizeSelector}
      >
        <option value="" disabled>
          Font Size
        </option>
        <option value="0.8rem">Small</option>
        <option value="1rem">Normal</option>
        <option value="1.25rem">Medium</option>
        <option value="1.5rem">Large</option>
        <option value="2rem">XL</option>
      </select>
    </div>
  );
}
