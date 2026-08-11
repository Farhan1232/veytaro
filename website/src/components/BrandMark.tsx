import "./BrandMark.css";

/**
 * The Veytaro mark, at a size worth downloading.
 *
 * The original `veytaro-mark.png` is 512×356 and 143 kB — it is kept for the
 * favicon set and social previews, but shipping it to draw a 30 px logo made it
 * by far the heaviest request on the page. These derivatives are 128 px wide
 * (comfortably 3× the largest on-page use) and are 4 kB as WebP, 14 kB as PNG.
 *
 * WebP first, PNG as the fallback: no build step is involved, so <picture>
 * does the negotiation and any browser without WebP still gets the mark.
 *
 * `alt` defaults to empty because the mark almost always sits next to the
 * word "Veytaro" — announcing it again would just repeat the brand name.
 */
export function BrandMark({
  width,
  alt = "",
  className,
}: {
  width: number;
  alt?: string;
  className?: string;
}) {
  // The source is 128×89; keeping that ratio in the attributes reserves the
  // right box before the image arrives, so nothing shifts on load.
  const height = Math.round((width * 89) / 128);

  return (
    <picture>
      <source srcSet="/veytaro-mark-128.webp" type="image/webp" />
      <img
        src="/veytaro-mark-128.png"
        alt={alt}
        width={width}
        height={height}
        className={className ? `brand-mark ${className}` : "brand-mark"}
        decoding="async"
      />
    </picture>
  );
}
