"use client";

import { ReactRenderer } from "@tiptap/react";
import type { 
  SuggestionKeyDownProps, 
  SuggestionOptions,
} from "@tiptap/suggestion";
import type { Editor, Range } from "@tiptap/core";
import tippy, { type Instance } from "tippy.js";
import Fuse from "fuse.js";

import { SLASH_COMMANDS, type SlashCommand } from "./slashCommands";
import { SlashCommands } from "../SlashCommands";

// Clean interface mapping key interception states safely
export interface SlashCommandsRef {
  onKeyDown(props: SuggestionKeyDownProps): boolean;
}

// Instantiate client-side fuzzy indexing maps targeting high-weight matches
const fuse = new Fuse(SLASH_COMMANDS, {
  keys: [
    { name: "title", weight: 1.0 },
    { name: "searchTerms", weight: 0.7 },
    { name: "description", weight: 0.4 }
  ],
  threshold: 0.3, // Strict balance preventing irrelevant layout noise
  distance: 100,
});

export const slashSuggestionConfig = (): Partial<SuggestionOptions<SlashCommand>> => ({
  char: "/",
  startOfLine: false,
  allowSpaces: false,

  // Deep structural scoring mechanics
  items: ({ query }) => {
    if (!query) return SLASH_COMMANDS;
    
    const searchResults = fuse.search(query);
    return searchResults.map((result: { item: SlashCommand }) => result.item);
  },

  // FIX 1: Exact internal structural parameters signature mapping to fix ts(2322)
  command: ({ 
    editor, 
    range, 
    props 
  }: { 
    editor: Editor; 
    range: Range; 
    props: SlashCommand 
  }) => {
    props.command({ editor, range });
  },

  render: () => {
    let component: ReactRenderer<SlashCommandsRef, any> | null = null;
    let popup: Instance[] = []; // Conforms perfectly to Tippy's array return value

    return {
      onStart: (props: any) => {
        // Wrap your component properties into a structure expected by ReactRenderer
        component = new ReactRenderer(SlashCommands, {
          props: {
            ...props,
            command: (item: SlashCommand) => props.command(item),
          },
          editor: props.editor,
        });

        if (!props.clientRect) return;

        // Configuration with robust safety parameters
        popup = tippy("body", {
          getReferenceClientRect: props.clientRect as () => DOMRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
          offset: [0, 8],     // Elegant 8px spatial separation padding
          maxWidth: 420,      // Prevents extreme responsive line layout expanding
          zIndex: 9999,       // Defends against underlying z-index layer leaks
          animation: false,
        });
      },

      onUpdate(props: any) {
        component?.updateProps({
          ...props,
          command: (item: SlashCommand) => props.command(item),
        });

        if (!props.clientRect) return;

        popup[0]?.setProps({
          getReferenceClientRect: props.clientRect as () => DOMRect,
        });
      },

      onKeyDown(props: SuggestionKeyDownProps) {
        if (props.event.key === "Escape") {
          popup[0]?.hide();
          return true;
        }

        // Execution pipeline flowing context directly via references without type casting
        return component?.ref?.onKeyDown(props) ?? false;
      },

      // FIX 2: Removed "onSuffix" to match Tiptap's native type boundaries
      onExit() {
        popup[0]?.destroy();
        component?.destroy();
        popup = [];
        component = null;
      },
    };
  },
});
