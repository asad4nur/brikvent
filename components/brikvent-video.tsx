"use client";

import { useState } from "react";
import { Play } from "lucide-react";

type Props = {
  videoId?: string;
  title?: string;
  caption?: string;
  className?: string;
};

// Click-to-load YouTube player. Until the visitor asks for the video, only its thumbnail is
// loaded: no YouTube script or cookie reaches the page, and nothing slows the form down.
export default function BrikventVideo({
  videoId = "u-QbIaehV48",
  title = "Brikvent: এক Platform-এ Online ও Offline Business Management",
  caption = "Brikvent কীভাবে কাজ করে · ৮ মিনিট",
  className = "",
}: Props) {
  const [playing, setPlaying] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // A video without the large thumbnail gets a 120px grey placeholder, which "loads" fine,
  // so the size is checked as well as the error event.
  const checkThumbnail = (img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0 && img.naturalWidth <= 120) setUseFallback(true);
  };

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-[20px] bg-[#165634] shadow-[0_24px_60px_-24px_rgba(22,86,52,0.5)] ring-1 ring-[#165634]/15 ${className}`}
    >
      {playing ? (
        <iframe
          // Keyboard users carry on inside the player they just opened
          ref={(frame) => {
            frame?.focus();
          }}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          role="button"
          onClick={() => setPlaying(true)}
          aria-label={`ভিডিও চালান: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-[#A9E54A]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- a plain image from YouTube, with its own fallback */}
          <img
            ref={checkThumbnail}
            src={`https://i.ytimg.com/vi/${videoId}/${useFallback ? "hqdefault" : "maxresdefault"}.jpg`}
            alt={`${title} (ভিডিওর থাম্বনেইল)`}
            width={1280}
            height={720}
            loading="lazy"
            decoding="async"
            onLoad={(e) => checkThumbnail(e.currentTarget)}
            onError={() => setUseFallback(true)}
            className="h-full w-full object-cover"
          />
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#7BCC46] text-[#165634] shadow-[0_14px_34px_-10px_rgba(22,86,52,0.75)] ring-4 ring-white/70 transition-[scale,background-color] duration-300 group-hover:scale-105 group-hover:bg-[#A9E54A] motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:h-[72px] sm:w-[72px]"
          >
            <Play className="ml-1 h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" />
          </span>
          <span
            lang="bn"
            aria-hidden
            className="absolute bottom-2.5 left-2.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#111827] shadow-md sm:bottom-4 sm:left-4 sm:px-4 sm:py-1.5 sm:text-sm"
          >
            {caption}
          </span>
        </button>
      )}
    </div>
  );
}
