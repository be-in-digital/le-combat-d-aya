/* eslint-disable @next/next/no-img-element */
import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { urlForImage } from "@/sanity/image";
import { VideoPlayer } from "@/components/video-player";

/**
 * Shared Portable Text renderer for `blockContent` (article bodies, legal
 * pages, mission details…). Handles headings, lists, links, inline images
 * (`figure`) and inline videos (`videoEmbed`).
 */
export const portableComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-serif text-primary text-3xl md:text-4xl leading-tight mt-12 mb-5">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-primary text-2xl md:text-3xl mt-10 mb-4">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-serif text-primary text-xl md:text-2xl mt-8 mb-3">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-base md:text-lg text-on-surface leading-relaxed mb-5">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="font-serif italic text-2xl md:text-3xl text-primary border-l-4 border-secondary/40 pl-6 my-10 leading-snug">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const blank = value?.blank ?? true;
      return (
        <a
          href={value?.href}
          {...(blank ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="text-secondary underline underline-offset-4 hover:text-primary transition-colors"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-primary">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-5 space-y-2 text-on-surface text-base md:text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-5 space-y-2 text-on-surface text-base md:text-lg">
        {children}
      </ol>
    ),
  },
  types: {
    figure: ({ value }) => {
      if (!value?.asset) return null;
      const url = urlForImage(value).width(1600).url();
      return (
        <figure className="my-10">
          <img
            src={url}
            alt={value.alt ?? ""}
            className="w-full rounded-2xl"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="text-sm text-on-surface-variant italic font-serif text-center mt-3">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    // Legacy inline images authored before the `figure` object existed.
    image: ({ value }) => {
      if (!value?.asset) return null;
      const url = urlForImage(value).width(1600).url();
      return (
        <figure className="my-10">
          <img
            src={url}
            alt={value.alt ?? ""}
            className="w-full rounded-2xl"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="text-sm text-on-surface-variant italic font-serif text-center mt-3">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    videoEmbed: ({ value }) => (
      <figure className="my-10">
        <VideoPlayer video={value} />
        {value?.caption && (
          <figcaption className="text-sm text-on-surface-variant italic font-serif text-center mt-3">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
};

export function PortableProse({
  value,
  className = "",
}: {
  value?: PortableTextBlock[] | null;
  className?: string;
}) {
  if (!value || value.length === 0) return null;
  return (
    <div className={className}>
      <PortableText value={value} components={portableComponents} />
    </div>
  );
}
