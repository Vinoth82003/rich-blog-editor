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
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import styles from "../styles/BlogEditor.module.css";
import Toolbar from "./Toolbar";
import { useRef, useState } from "react";
import { PrismCodeBlock } from "@/extensions/PrismCodeBlock"; // path to the custom extension
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/themes/prism.css";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/themes/prism-tomorrow.css";
import { CircleCheck } from "lucide-react";
import Spinner from "./Spinner";
import toast from "react-hot-toast";

export default function BlogEditor({ content, setContent, onBack, onSubmit, loading }) {
  const fileInputRef = useRef();
  // const [loading, setLoading] = useState(true);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      PrismCodeBlock,
      Image.configure({ allowBase64: true }),
      Youtube.configure({ width: 640, height: 360 }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start writing your blog..." }),
      TextStyle,
      Color,
      FontSize,
      // Add table extensions
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: styles.table,
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("uploading image please wait")
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        editor.chain().focus().setImage({ src: data.path }).run();
        console.log("data: ", data);

        toast.success("uploaded")
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error(err);
      toast.error(data.err);

      alert("Error uploading image!");
    } finally {
      toast.dismiss(toastId)
    }
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
        <button onClick={onBack} className={styles.backBtn} disabled={loading}>
          {loading ? <Spinner /> : "⬅ Back"}
        </button>
        <button
          onClick={onSubmit}
          className={styles.submitBtn}
          disabled={loading}
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              <CircleCheck size={16} /> Submit
            </>
          )}
        </button>
      </div>
    </div>
  );
}
