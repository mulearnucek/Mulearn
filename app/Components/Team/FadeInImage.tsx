"use client";

import { useState } from "react";
import NextImage from "next/image";

interface FadeInImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
}

export default function FadeInImage({
  src,
  alt,
  className = "",
  containerClassName = "",
  priority = false,
}: FadeInImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    !src ? "/fallback-avatar.png" : src.startsWith("http") || src.startsWith("/") ? src : `/${src}`,
  );

  const isRemoteSigned =
    imgSrc.includes("amazonaws.com") || imgSrc.includes("notion.so");

  return (
    <div
      className={`relative overflow-hidden bg-gray-200 ${containerClassName}`}
    >
      {!isLoaded && <div className="absolute inset-0 z-10 animate-shimmer" />}

      <NextImage
        src={imgSrc}
        alt={alt}
        fill
        priority={priority}
        unoptimized={isRemoteSigned}
        className={`${className} transition-all duration-1000 ease-in-out ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setImgSrc("/fallback-avatar.png");
          setIsLoaded(true);
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[inherit] pointer-events-none" />
    </div>
  );
}
