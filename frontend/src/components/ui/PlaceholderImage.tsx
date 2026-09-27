type PlaceholderImageProps = {
  label: string;
  accent?: string;
};

export function PlaceholderImage({
  label,
  accent = "#E091A3",
}: PlaceholderImageProps) {
  return (
    <div className="placeholder-image" aria-hidden="true">
      <svg viewBox="0 0 320 240" className="placeholder-svg">
        <rect width="320" height="240" fill="#F8E4E8" />
        <path d="M96 86h128l-12 92H108L96 86Z" fill={accent} />
        <path
          d="M132 86c0-22 12-36 28-36s28 14 28 36"
          fill="none"
          stroke="#2C1D16"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="248" cy="48" r="10" fill="#F3B7C2" />
        <path
          d="M40 198c28-18 70-18 98 4 24 18 62 16 92-8"
          fill="none"
          stroke="#6D8B6E"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
      <span>{label} · demostración</span>
    </div>
  );
}
