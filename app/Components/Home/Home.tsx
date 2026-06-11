"use client";

import homeHeroImage from "./assets/homeimg.svg";
import { BlueStar, WhiteStar, Mu } from "./assets/svg";
import data from "../../../data.json";
import Image from "next/image";

const Home = () => {
  return (
    <>
      <style>{`
                @media screen and (max-width: 900px) {
                    #home h1 { font-size: 9vw !important; }
                    #home h2 { font-size: 15vw !important; margin-top: -4vw !important; }
                    #home > div:first-child p { font-size: 2.4vw !important; width: 43vw !important; }
                    #home > div:first-child { margin-top: 16vh !important; }
                    #home .hero-container { height: 400px !important; }
                    .star1 { left: 17% !important; top: 30% !important; }
                    .star2 { right: 10% !important; top: 30% !important; }
                    .star3 { left: 27% !important; top: 12% !important; }
                    .star4 { right: 18% !important; top: 26% !important; }
                    .star5 { right: 48% !important; top: 13% !important; }
                    .star6 { left: -4% !important; top: 40% !important; }
                    .star7 { right: -5% !important; top: 30% !important; }
                    .star8 { right: 7% !important; top: 17% !important; }
                }
                @media screen and (max-width: 700px) {
                    #home { gap: 1vh !important; }
                    #home h1 { font-size: 11.5vw !important; margin-top: 6vw !important; }
                    #home h2 { font-size: 14vw !important; margin-top: -6vw !important; }
                    #home > div:first-child p { font-size: 3.5vw !important; width: 90% !important; }
                    #home > div:first-child { margin-top: 8vh !important; }
                    #home .hero-container { height: 350px !important; }
                    .star1 { left: 13% !important; top: 30% !important; }
                    .star2 { right: 10% !important; top: 35% !important; }
                    .star3 { left: 27% !important; top: 15% !important; }
                    .star4 { right: 14% !important; top: 30% !important; }
                    .star5 { right: 48.5% !important; top: 15% !important; }
                }
                @media screen and (max-width: 500px) {
                    #home { gap: 0.5vh !important; }
                    #home h1 { font-size: 11vw !important; margin-top: 25vw !important; }
                    #home h2 { font-size: 16vw !important; margin-top: -7vw !important; }
                    #home > div:first-child p { font-size: 3.8vw !important; width: 95% !important; }
                    #home > div:first-child { margin-top: 6vh !important; }
                    #home .hero-container { height: 380px !important; }
                }
            `}</style>
      <div
        id="home"
        className="relative w-full flex flex-col items-center justify-between mb-[5vh] gap-[3vh] overflow-hidden"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #c18bf5 0%, #fff 68.23%)",
        }}
      >
        <div
          className="flex flex-col items-center relative"
          style={{ marginTop: "20vh", zIndex: 9900 }}
        >
          <h1
            className="m-0 leading-tight"
            style={{ fontSize: "7vw", fontWeight: 600, color: "#171717" }}
          >
            Welcome to the
          </h1>
          <h2
            className="m-0 leading-tight font-bold"
            style={{ fontSize: "9vw", marginTop: "-3vw", color: "#ae59ff" }}
          >
            µverse
          </h2>
          <p
            className="text-center"
            style={{
              fontSize: "1.5vw",
              width: "25vw",
              color: "#171717",
              marginTop: "-1vw",
            }}
          >
            {data.college}
          </p>
        </div>
        <div className="relative w-full h-125 hero-container">
          <Image
            src={homeHeroImage}
            alt="MuLearn Hero"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>

        {/* Decorative Stars and Mu Elements */}
        <div
          className="absolute star1"
          style={{ zIndex: 7000, left: "15%", top: "25%" }}
        >
          <BlueStar size="50px" />
        </div>
        <div
          className="absolute star2"
          style={{ zIndex: 7000, right: "10%", top: "30%" }}
        >
          <BlueStar size="70px" />
        </div>
        <div
          className="absolute star3"
          style={{ zIndex: 7000, left: "27%", top: "12%" }}
        >
          <WhiteStar size="40px" />
        </div>
        <div
          className="absolute star4"
          style={{ zIndex: 7000, right: "27%", top: "28%" }}
        >
          <WhiteStar size="40px" />
        </div>

        <div
          className="absolute star5"
          style={{ zIndex: 0, right: "45%", top: "8%" }}
        >
          <Mu size="23vw" rotate="30deg" />
        </div>
        <div
          className="absolute star6"
          style={{ zIndex: 0, left: "-5%", top: "30%" }}
        >
          <Mu size="15vw" rotate="30deg" />
        </div>
        <div
          className="absolute star7"
          style={{ zIndex: 0, right: "-5%", top: "30%" }}
        >
          <Mu size="15vw" rotate="-10deg" />
        </div>
        <div
          className="absolute star8"
          style={{ zIndex: 0, right: "14%", top: "15%" }}
        >
          <Mu size="7vw" rotate="-10deg" />
        </div>
      </div>
    </>
  );
};

export default Home;
