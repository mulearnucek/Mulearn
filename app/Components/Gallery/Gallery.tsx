"use client";

import Marquee from "react-fast-marquee";
import data from "../../../data.json";
import Image from "next/image";

const Gallery = () => {
  const marqParams = {
    autoFill: true,
    pauseOnHover: true,
    speed: 80, //speed
  };

  // Helper to ensure image paths are valid for next/image
  const getImagePath = (path: string) => {
    if (!path) return "/fallback-image.png";
    if (path.startsWith("http") || path.startsWith("/")) return path;
    return `/${path}`;
  };

  return (
    <div className="pb-12 w-full" id="gallery">
      <h2
        className="text-[35px] text-center py-12 font-bold"
        style={{ color: "#ae59ff" }}
      >
        Memories
      </h2>
      <div className="relative">
        <Marquee {...marqParams} style={{ width: "100vw" }}>
          {data.gallery.row1.map((src, index) => (
            <div
              key={index}
              className="p-2 h-80 w-96 max-md:h-64 max-md:w-80 max-sm:h-52 max-sm:w-64 relative"
            >
              <Image
                src={getImagePath(src.image)}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover rounded-3xl p-2"
                sizes="(max-width: 768px) 320px, 384px"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default Gallery;
