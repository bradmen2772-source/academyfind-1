"use client";

import { useEditor as useTiptapEditor } from "@tiptap/react";

import { editorExtensions } from "../utils/editorExtensions";

type UseEditorProps = {
  content: string;

  editable?: boolean;

  autofocus?: boolean;

  placeholder?: string;

  onChange: (html: string) => void;
};

export function useEditor({
  content,
  editable = true,
  autofocus = false,
  placeholder = "Start writing your article...",
  onChange,
}: UseEditorProps) {
  const editor = useTiptapEditor({
    extensions: editorExtensions(placeholder),

    content,

    editable,

    autofocus,

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class: [
          "prose",
          "prose-slate",
          "dark:prose-invert",
          "max-w-none",
          "min-h-[650px]",
          "px-10",
          "py-8",
          "focus:outline-none",
        ].join(" "),
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return editor;
}