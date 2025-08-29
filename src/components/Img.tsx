// src\components\Img.tsx

// src/components/Img.tsx
interface ImgProps {
  src: string;
  alt: string;
  width: number; // intrinsic px
  height: number; // intrinsic px
  className?: string;
  priority?: boolean; // true for hero/LCP only
}

export default function Img({
  src,
  alt,
  width,
  height,
  className,
  priority,
}: Readonly<ImgProps>) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      // aspect-ratio is set implicitly by width/height, this just mirrors it in CSS
      style={{ aspectRatio: width / height }}
      className={className}
      // Chrome hint: only for the single hero image above the fold
      {...(priority ? { fetchpriority: "high" } : {})}
    />
  );
}
