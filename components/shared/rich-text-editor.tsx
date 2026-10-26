"use client";

import { useEffect, useRef } from "react";
import { Extension } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
  AlignJustify,
  AlignLeft,
  AlignCenter,
  AlignRight,
  IndentIncrease,
  IndentDecrease,
  PilcrowLeft,
  PilcrowRight,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  List,
  ListOrdered,
  Redo2,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";

// Preserve block formatting when saving HTML and opening it again.
const ParagraphAlignment = Extension.create({
  name: "paragraphAlignment",
  addGlobalAttributes() {
    return [{
      types: ["paragraph"],
      attributes: {
        textAlign: {
          default: null,
          parseHTML: (element) => element.style.textAlign || null,
          renderHTML: (attributes) => attributes.textAlign
            ? { style: `text-align: ${attributes.textAlign}` }
            : {},
        },
      },
    }, {
      types: ["paragraph", "bulletList", "orderedList"],
      attributes: {
        dir: {
          default: null,
          parseHTML: (element) => ["rtl", "ltr", "auto"].includes(element.dir) ? element.dir : null,
          renderHTML: (attributes) => attributes.dir ? { dir: attributes.dir } : {},
        },
      },
    }, {
      types: ["bulletList", "orderedList"],
      attributes: {
        listStyleType: {
          default: null,
          parseHTML: (element) => element.style.listStyleType || null,
          renderHTML: (attributes) => attributes.listStyleType
            ? { style: `list-style-type: ${attributes.listStyleType}` }
            : {},
        },
      },
    }];
  },
});

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
      ParagraphAlignment,
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
    shouldRerenderOnTransaction: true,
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setOptions({
      editorProps: {
        ...editor.options.editorProps,
        attributes: { ...editor.options.editorProps.attributes, dir },
      },
    });
  }, [dir, editor]);

  if (!editor) return null;

  function setDirection(direction: "rtl" | "ltr" | "auto") {
    if (!editor) return;
    editor.chain().focus()
      .updateAttributes("paragraph", { dir: direction })
      .updateAttributes("bulletList", { dir: direction })
      .updateAttributes("orderedList", { dir: direction })
      .run();
  }

  function setListStyle(type: "bulletList" | "orderedList", style: string) {
    if (!editor || !style) return;
    const chain = editor.chain().focus();
    if (!editor.isActive(type)) {
      if (type === "bulletList") chain.toggleBulletList();
      else chain.toggleOrderedList();
    }
    chain.updateAttributes(type, { listStyleType: style }).run();
  }

  const selectClassName = "h-8 max-w-full rounded-md border border-slate-600 bg-slate-900 px-2 text-xs text-slate-200 outline-none focus:border-teal-400";

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
        aria-label={label}
        aria-pressed={isActive}
        disabled={disabled}
        onMouseDown={(event) => event.preventDefault()}
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

        {([
          ["left", AlignLeft, "تراز چپ"],
          ["center", AlignCenter, "تراز وسط"],
          ["right", AlignRight, "تراز راست"],
          ["justify", AlignJustify, "تراز دوطرفه"],
        ] as const).map(([alignment, Icon, label]) => (
          <span key={alignment}>
            {toolbarButton(
              editor.isActive("paragraph", { textAlign: alignment }),
              () => editor.chain().focus().updateAttributes("paragraph", { textAlign: alignment }).run(),
              <Icon className="h-3.5 w-3.5" />,
              label,
            )}
          </span>
        ))}
        <span className="mx-1 h-4 w-px bg-slate-700" />
        {toolbarButton(
          editor.isActive("paragraph", { dir: "rtl" }),
          () => setDirection("rtl"),
          <PilcrowRight className="h-3.5 w-3.5" />,
          "راست به چپ (RTL)",
        )}
        {toolbarButton(
          editor.isActive("paragraph", { dir: "ltr" }),
          () => setDirection("ltr"),
          <PilcrowLeft className="h-3.5 w-3.5" />,
          "چپ به راست (LTR)",
        )}
        {toolbarButton(
          editor.isActive("paragraph", { dir: "auto" }),
          () => setDirection("auto"),
          <span className="text-[10px]">Auto</span>,
          "جهت خودکار متن",
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

        <select
          aria-label="نوع لیست نقطه‌ای"
          className={selectClassName}
          value={editor.isActive("bulletList") ? (editor.getAttributes("bulletList").listStyleType || "disc") : ""}
          onChange={(event) => setListStyle("bulletList", event.target.value)}
        >
          <option value="" disabled>نوع بولت</option>
          <option value="disc">نقطهٔ توپر</option>
          <option value="circle">دایرهٔ توخالی</option>
          <option value="square">مربع</option>
        </select>
        <select
          aria-label="نوع لیست شماره‌دار"
          className={selectClassName}
          value={editor.isActive("orderedList") ? (editor.getAttributes("orderedList").listStyleType || "decimal") : ""}
          onChange={(event) => setListStyle("orderedList", event.target.value)}
        >
          <option value="" disabled>نوع شماره‌گذاری</option>
          <option value="decimal">عددی (1, 2, 3)</option>
          <option value="persian">فارسی (۱، ۲، ۳)</option>
          <option value="lower-alpha">حروف کوچک (a, b, c)</option>
          <option value="upper-alpha">حروف بزرگ (A, B, C)</option>
          <option value="lower-roman">رومی کوچک (i, ii, iii)</option>
          <option value="upper-roman">رومی بزرگ (I, II, III)</option>
        </select>
        {toolbarButton(
          false,
          () => editor.chain().focus().sinkListItem("listItem").run(),
          <IndentIncrease className="h-3.5 w-3.5" />,
          "افزایش سطح لیست",
          !editor.can().sinkListItem("listItem"),
        )}
        {toolbarButton(
          false,
          () => editor.chain().focus().liftListItem("listItem").run(),
          <IndentDecrease className="h-3.5 w-3.5" />,
          "کاهش سطح لیست",
          !editor.can().liftListItem("listItem"),
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
