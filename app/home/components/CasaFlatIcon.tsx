"use client";

const ICONS: Record<string, React.ReactNode> = {
  Asterisk: (
    <path
      d="M12 4l1.5 4.5L18 10l-4.5 1.5L12 16l-1.5-4.5L6 10l4.5-1.5L12 4z"
      fill="currentColor"
    />
  ),
  Heart: (
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="currentColor"
    />
  ),
  House: (
    <path
      d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"
      fill="currentColor"
    />
  ),
  Bear: (
    <path
      d="M12 2c-1.1 0-2 .9-2 2 0 .74.4 1.38 1 1.72V7H6c-1.1 0-2 .9-2 2v2c0 .55.22 1.05.58 1.41L4 14v2h2v4h12v-4h2v-2l-.58-.59c.36-.36.58-.86.58-1.41V9c0-1.1-.9-2-2-2h-5V5.72c.6-.34 1-.98 1-1.72 0-1.1-.9-2-2-2z"
      fill="currentColor"
    />
  ),
};

export function CasaFlatIcon({
  icon,
  color,
  size = 28,
}: {
  icon: string;
  color: string;
  size?: number;
}) {
  const content = ICONS[icon] ?? ICONS.Asterisk;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
      style={{ color }}
    >
      {content}
    </svg>
  );
}
