"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import type { Editor } from "@tiptap/react";
import type { SuggestionKeyDownProps } from "@tiptap/suggestion";

import { cn } from "@/lib/utils";
import { SlashCommand, SlashCommandGroup } from "./utils/slashCommands";

export interface SlashCommandsRef {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

type Props = {
  editor: Editor;
  items: SlashCommand[];
  command: (item: SlashCommand) => void;
};

const GROUP_ORDER: SlashCommandGroup[] = [
  "Basic",
  "Formatting",
  "Media",
  "Tables",
  "Advanced",
];

const SlashCommands = forwardRef<SlashCommandsRef, Props>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Filter out disabled blocks instantly
    const activeItems = useMemo(() => {
      return items.filter((item) => !item.disabled);
    }, [items]);

    useEffect(() => {
      setSelectedIndex(0);
    }, [activeItems]);

    const groupedItems = useMemo(() => {
      return GROUP_ORDER.map((group) => ({
        group,
        items: activeItems.filter((item) => item.group === group),
      })).filter((group) => group.items.length);
    }, [activeItems]);

    const flatItems = useMemo(
      () => groupedItems.flatMap((g) => g.items),
      [groupedItems]
    );

    // FIX 2: Precompute O(n) hash table indices mapping ID strings to integers
    const indexMap = useMemo(() => {
      return new Map<string, number>(
        flatItems.map((item, index) => [item.id, index])
      );
    }, [flatItems]);

    // Track scroll alignment updates safely
    useEffect(() => {
      if (!scrollContainerRef.current) return;
      
      const activeEl = scrollContainerRef.current.querySelector(
        '[aria-selected="true"]'
      );
      
      if (activeEl) {
        activeEl.scrollIntoView({
          block: "nearest",
        });
      }
    }, [selectedIndex]);

    function selectItem(index: number) {
      const item = flatItems[index];
      if (!item) return;
      command(item);
    }

    useImperativeHandle(ref, () => ({
      onKeyDown({ event }: SuggestionKeyDownProps) {
        if (!flatItems.length) {
          return false;
        }

        switch (event.key) {
          case "ArrowUp":
            event.preventDefault();
            // FIX 3: Safe React functional closure loop tracking
            setSelectedIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length);
            return true;

          case "ArrowDown":
            event.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % flatItems.length);
            return true;

          // FIX 4: Add Home/End absolute viewport jump handling keys
          case "Home":
            event.preventDefault();
            setSelectedIndex(0);
            return true;

          case "End":
            event.preventDefault();
            setSelectedIndex(flatItems.length - 1);
            return true;

          case "Enter":
            event.preventDefault();
            selectItem(selectedIndex);
            return true;

          default:
            return false;
        }
      },
    }));

    return (
      <div className="w-[360px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        <div 
          ref={scrollContainerRef}
          role="listbox" // FIX 7: Semantic container classification layer
          aria-label="Slash commands menu options"
          className="max-h-[420px] overflow-y-auto py-2 scroll-smooth"
        >
          {groupedItems.map((section) => (
            <div key={section.group} role="group" aria-label={section.group}>
              <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {section.group}
              </div>

              {section.items.map((item) => {
                // Fetch the stable precomputed position mapping token instantly
                const currentIndex = indexMap.get(item.id)!;
                const isSelected = currentIndex === selectedIndex;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option" // Accessibility structure
                    aria-selected={isSelected}
                    onClick={() => selectItem(currentIndex)}
                    // FIX 5: Dynamic cursor hover tracking context synchronization
                    onMouseEnter={() => setSelectedIndex(currentIndex)}
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors outline-none",
                      isSelected ? "bg-amber-50" : "hover:bg-slate-50"
                    )}
                  >
                    {/* FIX 6: Rigid, explicit 36px layout boxes preventing flexible aspect squeezing */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 leading-normal">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}

          {/* FIX 8: UX Actionable Search Helper Fallback Layout View */}
          {!flatItems.length && (
            <div className="px-6 py-10 text-center">
              <p className="text-sm font-medium text-slate-900">No matching command found</p>
              <p className="mt-1 text-xs text-slate-400 max-w-[240px] mx-auto leading-normal">
                Try typing keywords like <span className="font-mono text-amber-600 bg-amber-50 px-1 rounded">heading</span>, <span className="font-mono text-amber-600 bg-amber-50 px-1 rounded">table</span>, or <span className="font-mono text-amber-600 bg-amber-50 px-1 rounded">list</span>.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

SlashCommands.displayName = "SlashCommands";

export { SlashCommands };
