"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";

type ShareButtonProps = {
  url: string;
  title: string;
  text?: string;
  className?: string;
};

export function ShareButton({ url, title, text, className = "" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const resolveUrl = () => {
    if (typeof window === "undefined") return url;
    try {
      return new URL(url, window.location.origin).toString();
    } catch {
      return url;
    }
  };

  const handleClick = async () => {
    const shareUrl = resolveUrl();
    const data: ShareData = { title, url: shareUrl, ...(text ? { text } : {}) };

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(data);
        return;
      } catch (err) {
        if ((err as DOMException)?.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copiez le lien", shareUrl);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Partager : ${title}`}
      className={className}
    >
      <span className="inline-flex items-center justify-center gap-2">
        <Icon name={copied ? "check" : "share"} className="text-base" />
        {copied ? "Lien copié" : "Partager"}
      </span>
    </button>
  );
}
