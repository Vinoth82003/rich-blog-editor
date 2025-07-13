  "use client";
  import { useEditor, EditorContent } from "@tiptap/react";
  import StarterKit from "@tiptap/starter-kit";
  import Image from "@tiptap/extension-image";
  import Youtube from "@tiptap/extension-youtube";
  import Placeholder from "@tiptap/extension-placeholder";
  import TextAlign from "@tiptap/extension-text-align";
  import { TextStyle } from "@tiptap/extension-text-style";
  import Color from "@tiptap/extension-color";
  import FontSize from "@tiptap/extension-font-size";
  import styles from "../styles/BlogEditor.module.css";
  import Toolbar from "./Toolbar";
  import { useRef } from "react";
  import { PrismCodeBlock } from "@/extensions/PrismCodeBlock"; // path to the custom extension
  import "prismjs/themes/prism-tomorrow.css";
  import "prismjs/themes/prism.css";
  import "prismjs/themes/prism-okaidia.css";
  import "prismjs/themes/prism-tomorrow.css";

  export default function BlogEditor({ content, setContent, onBack, onSubmit }) {
    const fileInputRef = useRef();

    const editor = useEditor({
      extensions: [
        StarterKit.configure({ codeBlock: false }),
        PrismCodeBlock, // ✅ use custom Prism block
        Image.configure({ allowBase64: true }),
        Youtube.configure({ width: 640, height: 360 }),
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Placeholder.configure({ placeholder: "Start writing your blog..." }),
        TextStyle,
        Color,
        FontSize,
      ],
      content,
      editorProps: {
        attributes: {
          class: styles.editorArea,
        },
      },
      onUpdate: ({ editor }) => setContent(editor.getHTML()),
      autofocus: true,
      editable: true,
      immediatelyRender: false,
    });

    const handleImageUpload = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result }).run();
      };
      reader.readAsDataURL(file);
    };

    return (
      <div className={styles.editorWrapper}>
        <Toolbar editor={editor} fileInputRef={fileInputRef} />
        <EditorContent editor={editor} />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageUpload}
        />
        <div className={styles.buttons}>
          <button onClick={onBack} className={styles.backBtn}>
            ⬅ Back
          </button>
          <button onClick={onSubmit} className={styles.submitBtn}>
            ✅ Submit
          </button>
        </div>
      </div>
    );
  }
