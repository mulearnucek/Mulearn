"use client";

import { useState } from "react";
import NextImage from "next/image";

interface FadeInImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export default function FadeInImage({
  src,
  alt,
  className = "",
  containerClassName = "",
}: FadeInImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Helper to ensure image paths are valid for next/image
  const getImagePath = (path: string) => {
    if (!path) return "/fallback-avatar.png";
    if (path.startsWith("http") || path.startsWith("/")) return path;
    return `/${path}`;
  };

  const imageSrc = getImagePath(src);

  // Notion/S3 URLs are often too complex for the Next.js image optimizer
  // and can cause timeouts. We serve them directly to the browser.
  const isRemoteS3 =
    imageSrc.includes("amazonaws.com") || imageSrc.includes("notion.so");

  return (
    <div
      className={`relative overflow-hidden bg-gray-200 ${containerClassName}`}
    >
      {/* Improved Skeleton Shimmer Effect */}
      {!isLoaded && <div className="absolute inset-0 z-10 animate-shimmer" />}

      <NextImage
        src={imageSrc}
        alt={alt}
        fill
        unoptimized={isRemoteS3}
        className={`${className} transition-all duration-1000 ease-in-out ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
        }`}
        onLoad={() => setIsLoaded(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Subtle ring overlay */}
      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[inherit] pointer-events-none" />
    </div>
  );
}
