import type { VideoEmbed } from "@/sanity/types";

function youTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m ? m[1] : null;
}

function vimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

/**
 * Renders a Sanity `videoEmbed`: an uploaded file, a direct MP4 URL, or a
 * YouTube / Vimeo link. Returns null when there's nothing to play.
 */
export function VideoPlayer({
  video,
  className = "",
}: {
  video?: VideoEmbed | null;
  className?: string;
}) {
  if (!video) return null;

  const poster = video.poster?.url ?? undefined;
  const wrapper = `relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] aspect-video bg-black ${className}`;

  // Uploaded file
  if (video.source === "file" && video.fileUrl) {
    return (
      <div className={wrapper}>
        <video
          controls
          playsInline
          poster={poster}
          className="w-full h-full object-cover"
        >
          <source src={video.fileUrl} />
        </video>
      </div>
    );
  }

  const url = video.url;
  if (!url) return null;

  const yt = youTubeId(url);
  if (yt) {
    return (
      <div className={wrapper}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${yt}`}
          title={video.title ?? "Vidéo"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  const vm = vimeoId(url);
  if (vm) {
    return (
      <div className={wrapper}>
        <iframe
          src={`https://player.vimeo.com/video/${vm}`}
          title={video.title ?? "Vidéo"}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  // Direct video URL (mp4, webm…)
  return (
    <div className={wrapper}>
      <video
        controls
        playsInline
        poster={poster}
        className="w-full h-full object-cover"
      >
        <source src={url} />
      </video>
    </div>
  );
}
