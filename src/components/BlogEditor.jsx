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
import { useRef, useState, useEffect } from "react";
import { PrismCodeBlock } from "@/extensions/PrismCodeBlock";
import "prismjs/themes/prism-tomorrow.css";
import { CircleCheck } from "lucide-react";
import Spinner from "./Spinner";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';

export default function BlogEditor({ content, setContent, onBack, onSubmit, loading }) {
  const fileInputRef = useRef();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      PrismCodeBlock,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'blog-image',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'blog-video',
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Placeholder.configure({
        placeholder: "Start writing your blog...",
        emptyEditorClass: styles.emptyEditor,
      }),
      TextStyle,
      Color,
      FontSize,
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
        class: `${styles.editorArea} ${styles.prose}`,
        spellcheck: 'true',
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          if (event.key === 'Enter' && view.state.selection.$from.parent.type.name === 'table_cell') {
            event.preventDefault();
            return true;
          }
          return false;
        },
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    autofocus: 'end',
    editable: true,
    // Explicitly set to false to avoid hydration mismatches
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor || !isMounted) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;

        if (empty && $from.parent.type.name === 'image') {
          event.preventDefault();
          const node = $from.parent;
          const imageUrl = node.attrs.src;
          const isImgBBImage = uploadedImages.includes(imageUrl);

          Swal.fire({
            title: 'Delete Image?',
            html: isImgBBImage
              ? 'This image will be permanently deleted from our servers.'
              : 'This embedded image will be removed from the post.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                if (isImgBBImage) {
                  setUploadedImages(prev => prev.filter(url => url !== imageUrl));
                }

                const pos = $from.before();
                editor.chain().focus().setTextSelection(pos).deleteSelection().run();
                toast.success('Image removed');
              } catch (error) {
                console.error('Error deleting image:', error);
                toast.error(error.message || 'Failed to delete image');
              }
            }
          });
        }
      }
    };

    editor.on('keydown', handleKeyDown);
    return () => {
      editor.off('keydown', handleKeyDown);
    };
  }, [editor, uploadedImages, isMounted]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, WEBP, or GIF images are allowed');
      return;
    }

    if (file.size > 32 * 1024 * 1024) {
      toast.error('Image must be smaller than 32MB');
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    const apiKey = '5211b2cf516cac1af99ded9c6c78e096';
    const toastId = toast.loading("Uploading image...");

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();

      if (data.success) {
        const imageUrl = data.data.url;
        editor.chain().focus()
          .setImage({
            src: imageUrl,
            alt: file.name,
            title: file.name
          })
          .run();

        setUploadedImages(prev => [...prev, imageUrl]);
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.message || "Failed to upload image");
    } finally {
      toast.dismiss(toastId);
      e.target.value = '';
    }
  };

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className={styles.editorWrapper}>
      <Toolbar
        editor={editor}
        fileInputRef={fileInputRef}
      />

      <EditorContent
        editor={editor}
        className={styles.editorContent}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleImageUpload}
      />

      <div className={styles.buttons}>
        <button
          onClick={onBack}
          className={styles.backBtn}
          disabled={loading}
          aria-label="Go back"
        >
          {loading ? <Spinner size={18} /> : "⬅ Back"}
        </button>
        <button
          onClick={onSubmit}
          className={styles.submitBtn}
          disabled={loading}
          aria-label="Submit post"
        >
          {loading ? (
            <Spinner size={18} />
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