import Image from "next/image";
import type { SanityImage } from "@/sanity/types";

type Props = {
  image?: SanityImage | null;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function ArticleCover({
  image,
  fallbackSrc,
  alt,
  className = "",
  sizes,
  priority,
}: Props) {
  const src = image?.url ?? fallbackSrc ?? null;
  if (!src) return null;

  if (src.startsWith("https://cdn.sanity.io") && image?.dimensions) {
    return (
      <Image
        src={src}
        alt={image.alt ?? alt}
        fill
        sizes={sizes ?? "(min-width: 1024px) 50vw, 100vw"}
        placeholder={image.lqip ? "blur" : undefined}
        blurDataURL={image.lqip ?? undefined}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={image?.alt ?? alt}
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
    />
  );
}
