"use client";

import { ULearn } from "../../assets/svg/svg";
import data from "../../../data.json";
import { useEffect, useRef, useState } from "react";

const Statistics = () => {
  const [counters, setCounters] = useState<number[]>([0, 0, 0, 0]); // Initialize counters
  const durationInSeconds = 3; // Duration in seconds

  const targetRef = useRef<HTMLDivElement>(null); // Create a ref

  const isElementInViewport = (el: HTMLElement | null) => {
    if (!el) {
      return false;
    }
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  useEffect(() => {
    const currentTarget = targetRef.current;
    const finalValues: number[] = [
      data.statistics.studentsCount ?? 0,
      data.statistics.learningCircles ?? 0,
      data.statistics.InterestGroups ?? 0,
      data.statistics.karmaEarned ?? 0,
    ];

    const startCounterAnimation = () => {
      const interval = setInterval(() => {
        setCounters((prevCounters) =>
          prevCounters.map((counter, index) =>
            counter < finalValues[index]
              ? counter +
                Math.ceil(finalValues[index] / (durationInSeconds * 20)) // Increment smoothly
              : finalValues[index],
          ),
        );
      }, 50);

      return () => clearInterval(interval);
    };

    let cleanup: (() => void) | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          cleanup = startCounterAnimation();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      },
    );

    if (currentTarget) {
      if (isElementInViewport(currentTarget)) {
        cleanup = startCounterAnimation();
      } else {
        observer.observe(currentTarget);
      }
    }

    return () => {
      if (cleanup) {
        cleanup();
      }
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full gap-6 mb-[5vh]">
      <h1 className="text-3xl font-bold" style={{ color: "#ae59ff" }}>
        Our Statistics
      </h1>
      <div
        className="flex w-full px-[10vw] py-5 items-center justify-between gap-[10vw] max-sm:flex-col-reverse max-sm:px-[8vw] max-sm:gap-[5vw] max-xs:px-[5vw] max-xs:px-[2vw]"
        style={{
          backgroundImage: 'url("/bg-statistics.svg")',
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="flex flex-wrap gap-4 items-center justify-between w-full max-sm:justify-center max-sm:gap-6"
          ref={targetRef}
        >
          {counters.map((counter, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center"
            >
              <h3 className="font-bold text-[35px]">
                {index >= 0
                  ? counter >= 2
                    ? counter == data.statistics.karmaEarned
                      ? `${counter}k+`
                      : `${counter}+`
                    : counter
                  : counter.toLocaleString()}
              </h3>
              <p
                className="text-[20px] max-sm:text-xs font-normal"
                style={{ color: "#ae59ff" }}
              >
                {index === 0
                  ? "STUDENTS"
                  : index === 1
                    ? "LEARNING"
                    : index === 2
                      ? "INTEREST"
                      : "KARMA"}
              </p>
              <p
                className="text-[20px] max-sm:text-xs font-normal"
                style={{ color: "#ae59ff" }}
              >
                {index === 0
                  ? "ENROLLED"
                  : index === 1
                    ? "CIRCLES"
                    : index === 2
                      ? "GROUPS"
                      : "MINED"}
              </p>
            </div>
          ))}
        </div>
        <div className="w-fit flex flex-col items-center justify-center">
          <ULearn />
          <h2>Rank:{data.statistics.rank}</h2>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
