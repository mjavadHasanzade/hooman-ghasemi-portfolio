"use client";

import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  List,
  ListOrdered,
  Redo2,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  dir?: "rtl" | "ltr";
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  dir = "ltr",
  className = "",
}: RichTextEditorProps) {
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Underline,
      Placeholder.configure({
        placeholder: placeholder ?? "",
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        dir,
        // Hardcoded colors instead of semantic tokens — guarantees
        // readable white-on-dark text regardless of theme resolution.
        class:
          "min-h-40 w-full bg-transparent px-4 py-3 text-sm leading-7 text-slate-100 outline-none caret-teal-400 " +
          "[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 " +
          "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:ps-5 " +
          "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:ps-5 " +
          "[&_strong]:font-semibold [&_em]:italic [&_u]:underline " +
          "[&_.is-editor-empty]:text-slate-500 " +
          "[&_.is-editor-empty::before]:content-[attr(data-placeholder)] [&_.is-editor-empty::before]:float-start [&_.is-editor-empty::before]:pointer-events-none [&_.is-editor-empty::before]:h-0",
      },
    },
    onUpdate: ({ editor }) => {
      onChangeRef.current(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  function toolbarButton(
    isActive: boolean,
    onClick: () => void,
    icon: React.ReactNode,
    label: string,
    disabled?: boolean,
  ) {
    return (
      <button
        type="button"
        title={label}
        disabled={disabled}
        onClick={onClick}
        className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
          isActive
            ? "bg-teal-500/20 text-teal-400"
            : "text-slate-400 hover:bg-slate-700/60 hover:text-slate-100"
        }`}
      >
        {icon}
      </button>
    );
  }

  return (
    <div
      dir={dir}
      className={`overflow-hidden rounded-xl border border-slate-700 bg-slate-800/80 transition-colors focus-within:border-teal-500 focus-within:ring-3 focus-within:ring-teal-500/15 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-700 bg-slate-900/60 px-2 py-1.5">
        {toolbarButton(
          editor.isActive("bold"),
          () => editor.chain().focus().toggleBold().run(),
          <BoldIcon className="h-3.5 w-3.5" />,
          "درشت",
        )}
        {toolbarButton(
          editor.isActive("italic"),
          () => editor.chain().focus().toggleItalic().run(),
          <ItalicIcon className="h-3.5 w-3.5" />,
          "مورب",
        )}
        {toolbarButton(
          editor.isActive("underline"),
          () => editor.chain().focus().toggleUnderline().run(),
          <UnderlineIcon className="h-3.5 w-3.5" />,
          "زیرخط",
        )}

        <span className="mx-1 h-4 w-px bg-slate-700" />

        {toolbarButton(
          editor.isActive("bulletList"),
          () => editor.chain().focus().toggleBulletList().run(),
          <List className="h-3.5 w-3.5" />,
          "لیست نقطه‌ای",
        )}
        {toolbarButton(
          editor.isActive("orderedList"),
          () => editor.chain().focus().toggleOrderedList().run(),
          <ListOrdered className="h-3.5 w-3.5" />,
          "لیست شماره‌دار",
        )}

        <span className="mx-1 h-4 w-px bg-slate-700" />

        {toolbarButton(
          false,
          () => editor.chain().focus().undo().run(),
          <Undo2 className="h-3.5 w-3.5" />,
          "واگرد",
          !editor.can().undo(),
        )}
        {toolbarButton(
          false,
          () => editor.chain().focus().redo().run(),
          <Redo2 className="h-3.5 w-3.5" />,
          "ازنو",
          !editor.can().redo(),
        )}
      </div>
      <EditorContent editor={editor} dir={dir} />
    </div>
  );
}

export function stripHtml(html: string): string {
  if (typeof window === "undefined") {
    return html.replace(/<[^>]*>/g, "");
  }
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent ?? div.innerText ?? "";
}
