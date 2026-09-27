import { instagramHandle, instagramUrl } from "../../lib/brand";

type InstagramLinkProps = {
  className?: string;
  withLabel?: boolean;
};

export function InstagramLink({ className, withLabel = true }: InstagramLinkProps) {
  return (
    <a
      className={className}
      href={instagramUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`Instagram de Ari´s Bags, ${instagramHandle}`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" />
      </svg>
      {withLabel && <span>Instagram</span>}
    </a>
  );
}
