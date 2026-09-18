"use client";

import { TypeAnimation } from "react-type-animation";

export default function TypingHeading() {
  return (
    <div className="min-h-[70px] sm:min-h-[90px]">
      <TypeAnimation
        sequence={[
          "Career Path",
          4000,

          "JEE Coaching",
          2000,
          "NEET Coaching",
          2000,
          "UPSC Coaching",
          2000,
          "CAT Coaching",
          2000,
          "CLAT Coaching",
          2000,
          "CUET Coaching",
          2000,
        ]}
        wrapper="span"
        speed={40}
        repeat={Infinity}
        className="
          block
          text-amber-400
        "
      />
    </div>
  );
}