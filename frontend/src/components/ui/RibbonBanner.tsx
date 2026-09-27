type RibbonBannerProps = {
  name: string;
  subtitle?: string;
  as?: "h1" | "strong";
};

export function RibbonBanner({ name, subtitle, as = "h1" }: RibbonBannerProps) {
  const Title = as;

  return (
    <div className="char-ribbon">
      <div className="char-ribbon-art">
        <img src="/brand/ribbon-mold.png" alt="" className="char-ribbon-img" />
        <div className="char-ribbon-name">
          <i aria-hidden>♥</i>
          <Title>{name}</Title>
          <i aria-hidden>♥</i>
        </div>
        {subtitle ? (
          <p className="char-subtitle">
            <img src="/brand/legend-ribbon.png" alt="" className="char-legend" />
            <span>{subtitle}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
