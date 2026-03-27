"use client";

import type { CSSProperties } from "react";

type Props = {
  className?: string;
  style?: CSSProperties;
};

export function Vector2Shape({ className, style }: Props) {
  return (
    <svg
      viewBox="0 0 1925 1114"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      role="img"
      aria-label="Vector panel"
      preserveAspectRatio="none"
    >
      <path
        d="M0.5 1040.78V0.5H1858.64L1923.52 72.3236V1040.78H1779.87L1701.09 1112.61H72.324L0.5 1040.78Z"
        fill="#FF0000"
        stroke="black"
      />
    </svg>
  );
}

