"use client";

import { useState, useEffect } from "react";

export default function AnimatedCounter({
  value,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500; // 1.5 seconds me animation puri hogi
    const steps = 60;
    const increment = value / steps;
    const interval = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}