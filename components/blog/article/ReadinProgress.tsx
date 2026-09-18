"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import clsx from "clsx";

interface ReadingProgressProps {
  /**
   * Optional article container id.
   * If omitted, progress is calculated against the entire page.
   */
  targetId?: string;

  /**
   * Additional class names.
   */
  className?: string;

  /**
   * Height of the progress bar.
   */
  height?: number;
}

export default function ReadingProgress({
  targetId,
  className,
  height = 4,
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  const smoothProgress = useSpring(progress, {
    stiffness: 140,
    damping: 28,
    mass: 0.25,
  });

  useEffect(() => {
    let frame = 0;

    const calculateProgress = () => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        if (targetId) {
          const article = document.getElementById(targetId);

          if (!article) {
            setProgress(0);
            return;
          }

          const rect = article.getBoundingClientRect();

          const articleTop = window.scrollY + rect.top;
          const articleHeight = article.offsetHeight;
          const viewportHeight = window.innerHeight;

          const totalScrollable = articleHeight - viewportHeight;

          if (totalScrollable <= 0) {
            setProgress(100);
            return;
          }

          const current = window.scrollY - articleTop;

          const percent = Math.min(
            100,
            Math.max(0, (current / totalScrollable) * 100)
          );

          setProgress(percent);
        } else {
          const scrollTop = window.scrollY;

          const scrollHeight =
            document.documentElement.scrollHeight - window.innerHeight;

          const percent =
            scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

          setProgress(Math.min(100, Math.max(0, percent)));
        }
      });
    };

    calculateProgress();

    window.addEventListener("scroll", calculateProgress, { passive: true });
    window.addEventListener("resize", calculateProgress);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", calculateProgress);
      window.removeEventListener("resize", calculateProgress);
    };
  }, [targetId]);

  return (
    <div
      aria-hidden="true"
      className={clsx(
        "pointer-events-none fixed inset-x-0 top-0 z-[100]",
        className
      )}
      style={{ height }}
    >
      <motion.div
        className="h-full origin-left bg-amber-500"
        style={{
          scaleX: smoothProgress,
          transformOrigin: "0% 50%",
        }}
        animate={{
          scaleX: progress / 100,
        }}
        transition={{
          type: "spring",
          stiffness: 140,
          damping: 28,
        }}
      />
    </div>
  );
}