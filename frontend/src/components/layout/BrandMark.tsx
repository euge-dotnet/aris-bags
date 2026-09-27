type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <span className={compact ? "brand brand-compact" : "brand"}>
      <img
        className="brand-logo"
        src="/brand/logo.png"
        alt="Ari´s Bags, bolsas que te acompañan"
      />
    </span>
  );
}
