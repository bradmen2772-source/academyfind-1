import type { Editor } from "@tiptap/react";
import type { LucideIcon } from "lucide-react";

import {
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  ImageIcon,
  Table2,
  Code2,
  Minus,
  AlertCircle,
  ChevronRight,
  Smile,
  Bookmark,
  GitFork,
  Sigma,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";

export type SlashCommandGroup =
  | "Basic"
  | "Formatting"
  | "Media"
  | "Tables"
  | "Advanced";

export interface SlashCommandContext {
  editor: Editor;
  range: { from: number; to: number };
}

export interface SlashCommand {
  id: string;
  title: string;
  description: string;
  group: SlashCommandGroup;
  icon: LucideIcon | React.ComponentType;
  searchTerms: string[];
  command: (context: SlashCommandContext) => void;
  disabled?: boolean;
}

export const SLASH_COMMANDS: SlashCommand[] = [
  /* ==========================================================================
     BASIC GROUP
     ========================================================================== */
  {
    id: "paragraph",
    title: "Paragraph",
    description: "Start writing plain text.",
    group: "Basic",
    icon: Pilcrow,
    searchTerms: ["paragraph", "text", "normal", "body", "plain", "p"],
    command({ editor, range }) {
      // Deterministic block setting instead of toggle
      editor.chain().focus().deleteRange(range).setParagraph().run();
    },
  },
  {
    id: "h1",
    title: "Heading 1",
    description: "Large section heading.",
    group: "Basic",
    icon: Heading1,
    searchTerms: ["h1", "title", "header", "heading", "large", "big"],
    command({ editor, range }) {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
    },
  },
  {
    id: "h2",
    title: "Heading 2",
    description: "Medium section heading.",
    group: "Basic",
    icon: Heading2,
    searchTerms: ["h2", "subtitle", "header", "heading", "medium"],
    command({ editor, range }) {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
    },
  },
  {
    id: "h3",
    title: "Heading 3",
    description: "Small section heading.",
    group: "Basic",
    icon: Heading3,
    searchTerms: ["h3", "subheading", "header", "heading", "small"],
    command({ editor, range }) {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
    },
  },

  /* ==========================================================================
     FORMATTING GROUP
     ========================================================================== */
  {
    id: "bullet",
    title: "Bullet List",
    description: "Create an unordered list.",
    group: "Formatting",
    icon: List,
    searchTerms: ["list", "bullet", "unordered", "ul"],
    command({ editor, range }) {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    id: "ordered",
    title: "Numbered List",
    description: "Create an ordered list.",
    group: "Formatting",
    icon: ListOrdered,
    searchTerms: ["ordered", "number", "sequence", "ol", "list"],
    command({ editor, range }) {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    id: "task",
    title: "Task List",
    description: "Create a checklist.",
    group: "Formatting",
    icon: CheckSquare,
    searchTerms: ["task", "todo", "check", "list", "checkbox"],
    command({ editor, range }) {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    id: "toggle-list",
    title: "Toggle List",
    description: "Togglable details block.",
    group: "Formatting",
    icon: ChevronRight,
    searchTerms: ["toggle", "collapse", "details", "summary", "list"],
    disabled: true, // Stubbed for later extension setup
    command({ editor, range }) {
      editor.chain().focus().deleteRange(range).run();
    },
  },
  {
    id: "quote",
    title: "Quote",
    description: "Insert a quote block.",
    group: "Formatting",
    icon: Quote,
    searchTerms: ["quote", "blockquote", "cite", "block"],
    command({ editor, range }) {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    id: "callout",
    title: "Callout",
    description: "Asymmetrical alert panel.",
    group: "Formatting",
    icon: AlertCircle,
    searchTerms: ["callout", "alert", "notice", "info", "warning", "box"],
    disabled: true,
    command({ editor, range }) {
      editor.chain().focus().deleteRange(range).run();
    },
  },

  /* ==========================================================================
     MEDIA GROUP
     ========================================================================== */
  {
    id: "image",
    title: "Image",
    description: "Upload or insert an image link.",
    group: "Media",
    icon: ImageIcon,
    searchTerms: ["image", "photo", "upload", "picture", "file", "img"],
    command({ editor, range }) {
      // Clean up slash text tracking nodes instantly
      editor.chain().focus().deleteRange(range).run();
      // Decoupled global event listener trigger hook
      window.dispatchEvent(new CustomEvent("editor:image-picker"));
    },
  },
  {
    id: "youtube",
    title: "Youtube",
    description: "Embed a YouTube video.",
    group: "Media",
    icon: FaYoutube,
    searchTerms: ["youtube", "video", "embed", "player", "stream"],
    command({ editor, range }) {
      editor.chain().focus().deleteRange(range).run();
      // Emits direct window action caught by separate components
      window.dispatchEvent(new CustomEvent("editor:youtube-dialog"));
    },
  },
  {
    id: "bookmark",
    title: "Bookmark",
    description: "Link card overview preview.",
    group: "Media",
    icon: Bookmark,
    searchTerms: ["bookmark", "link", "card", "url", "preview"],
    disabled: true,
    command({ editor, range }) {
      editor.chain().focus().deleteRange(range).run();
    },
  },

  /* ==========================================================================
     TABLES GROUP
     ========================================================================== */
  {
    id: "table",
    title: "Table",
    description: "Insert a table.",
    group: "Tables",
    icon: Table2,
    searchTerms: ["table", "grid", "matrix", "cells", "rows", "cols"],
    command({ editor, range }) {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        // Smooth UX navigation auto-focusing on the first matrix coordinate cell
        .goToNextCell()
        .run();
    },
  },

  /* ==========================================================================
     ADVANCED GROUP
     ========================================================================== */
  {
    id: "code",
    title: "Code Block",
    description: "Insert syntax highlighted code.",
    group: "Advanced",
    icon: Code2,
    searchTerms: ["code", "snippet", "syntax", "pre", "programming", "lowlight"],
    command({ editor, range }) {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    id: "divider",
    title: "Divider",
    description: "Insert a horizontal rule.",
    group: "Advanced",
    icon: Minus,
    searchTerms: ["divider", "line", "hr", "separator", "rule"],
    command({ editor, range }) {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setHorizontalRule()
        // Forces insertion step down to prevent the text cursor freezing on top of HR
        .insertContent("\n")
        .run();
    },
  },
  {
    id: "emoji",
    title: "Emoji",
    description: "Open emoji search picker window.",
    group: "Advanced",
    icon: Smile,
    searchTerms: ["emoji", "smile", "icon", "picker", "face"],
    disabled: true,
    command({ editor, range }) {
      editor.chain().focus().deleteRange(range).run();
    },
  },
  {
    id: "mermaid",
    title: "Mermaid Diagram",
    description: "Render complex flow charts via code block syntax.",
    group: "Advanced",
    icon: GitFork,
    searchTerms: ["mermaid", "graph", "diagram", "chart", "flow", "render"],
    disabled: true,
    command({ editor, range }) {
      editor.chain().focus().deleteRange(range).run();
    },
  },
  {
    id: "math",
    title: "Math Block",
    description: "Format formulas with LaTeX typesetting equations.",
    group: "Advanced",
    icon: Sigma,
    searchTerms: ["math", "latex", "formula", "equation", "katex", "sigma"],
    disabled: true,
    command({ editor, range }) {
      editor.chain().focus().deleteRange(range).run();
    },
  },
];
