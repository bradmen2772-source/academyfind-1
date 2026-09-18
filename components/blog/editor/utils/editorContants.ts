import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Table,
  Underline,
  Undo2,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";

export const EDITOR_COLORS = [
  "#000000",
  "#475569",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#6366f1",
  "#a855f7",
];

export const HIGHLIGHT_COLORS = [
  "#FEF08A",
  "#FDE68A",
  "#FCA5A5",
  "#BFDBFE",
  "#BBF7D0",
  "#DDD6FE",
];

export const HEADING_LEVELS = [
  { level: 1, label: "Heading 1", icon: Heading1 },
  { level: 2, label: "Heading 2", icon: Heading2 },
  { level: 3, label: "Heading 3", icon: Heading3 },
];

export const TOOLBAR_GROUPS = {
  history: [
    { name: "undo", icon: Undo2 },
    { name: "redo", icon: Redo2 },
  ],

  formatting: [
    { name: "bold", icon: Bold },
    { name: "italic", icon: Italic },
    { name: "underline", icon: Underline },
    { name: "strike", icon: Strikethrough },
    { name: "highlight", icon: Highlighter },
    { name: "code", icon: Code2 },
  ],

  alignment: [
    { name: "left", icon: AlignLeft },
    { name: "center", icon: AlignCenter },
    { name: "right", icon: AlignRight },
    { name: "justify", icon: AlignJustify },
  ],

  lists: [
    { name: "bullet", icon: List },
    { name: "ordered", icon: ListOrdered },
    { name: "quote", icon: Quote },
  ],

  insert: [
    { name: "image", icon: ImageIcon },
    { name: "link", icon: Link2 },
    { name: "table", icon: Table },
    { name: "youtube", icon: FaYoutube },
    { name: "divider", icon: Minus },
  ],
} as const;