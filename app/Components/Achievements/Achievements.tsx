"use client";

import data from "../../../data.json";
import Image from "next/image";

const Achievements = () => {
  // Helper to ensure image paths are valid for next/image
  const getImagePath = (path: string) => {
    if (!path) return "/fallback-image.png";
    if (path.startsWith("http") || path.startsWith("/")) return path;
    return `/${path}`;
  };

  return (
    <div
      id="achievements"
      className="flex flex-col items-center justify-center text-center gap-6 py-[5vh] px-[5%] w-full max-md:gap-3.75 max-md:py-[3vh]"
    >
      <h1
        className="text-[35px] max-md:text-[2rem] font-bold"
        style={{ color: "#ae59ff" }}
      >
        Achievements
      </h1>
      <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl max-lg:gap-6 max-md:gap-4">
        {data.achievements.map((achievement, index) => (
          <div
            key={index}
            className="flex flex-col items-center w-full max-w-lg rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 max-md:max-w-96 max-sm:max-w-full"
          >
            <div className="w-full h-auto min-h-50 bg-gray-100 overflow-hidden relative aspect-video">
              <Image
                src={getImagePath(achievement.image)}
                alt={achievement.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 512px"
                priority={index < 2}
              />
            </div>
            <div
              className={`p-5 w-full bg-white text-left ${
                index === 1 ? "text-center pt-[37.5px]" : ""
              }`}
            >
              <h3
                className="text-center font-bold mb-2.5 text-2xl max-md:text-lg max-sm:text-base"
                style={{ color: "#ae59ff" }}
              >
                {achievement.title}
              </h3>
              <p
                className={`text-base text-gray-500 max-md:text-sm ${
                  index === 1 ? "text-center" : ""
                }`}
              >
                {achievement.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
