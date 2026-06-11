import { Discord, Whatsapp } from "./assets/svg";
import data from "../../../data.json";
import Image from "next/image";

const Connect = () => {
  return (
    <div
      id="contact"
      className="flex flex-col md:mt-[5vh] md:mb-[5vh] sm:mt-[5vh] :mb-[7vh] items-center w-full py-[15vh] px-[10vw] max-lg:px-[8vw] max-lg:py-0 max-md:px-[7vw] max-sm:px-[6vw] gap-6 z-100 bg-white"
    >
      <h1
        className="text-[35px] max-sm:text-[30px] font-bold"
        style={{ color: "#ae59ff" }}
      >
        Connect With Us
      </h1>
      <div
        className="flex w-full border-2 rounded-[10px] h-87.5 mb-[5vh] max-lg:h-75 max-md:h-70 max-sm:h-fit max-sm:flex-col max-sm:items-center items-center overflow-hidden"
        style={{ borderColor: "#ae59ff" }}
      >
        <div className="p-[7%] w-1/2 flex flex-col justify-center max-lg:p-[6%] max-lg:w-full max-md:p-[4%] max-sm:p-[5%] max-sm:items-center max-sm:text-center gap-5">
          <div className="max-sm:gap-2 flex flex-col">
            <h2 className="text-[32px] max-lg:text-[28px] max-md:text-[25px] max-sm:text-[24px]">
              Join µLearn {data.collegeCode} Discord server!
            </h2>
            <p
              className="text-[25px] max-lg:text-[20px] max-md:text-[16px] max-sm:text-[14px] my-2 max-sm:m-0 max-sm:mt-1"
              style={{ color: "#757575" }}
            >
              Do join our campus community discord server, so you don&apos;t
              miss out any of the updates.
            </p>
          </div>
          <div className="flex items-center gap-5 max-md:gap-2.5 max-sm:gap-2.5 max-sm:flex-wrap max-sm:justify-center">
            <a
              href={data.discordLink}
              className="flex items-center justify-center gap-2 w-fit px-5 py-2 rounded-lg border-2 text-[18px] max-md:text-[16px] max-sm:text-[14px] max-sm:px-3 max-sm:py-1.5 max-sm:w-45 max-sm:justify-center text-white"
              style={{ backgroundColor: "#ae59ff", borderColor: "#ae59ff" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Discord />
              Join Discord
            </a>
            <a
              href={data.whatsAppLink}
              className="flex items-center justify-center gap-2 w-fit px-5 py-2 rounded-lg border-2 text-[18px] max-md:text-[16px] max-sm:text-[14px] max-sm:px-3 max-sm:py-1.5 max-sm:w-45 max-sm:justify-center"
              style={{ color: "#ae59ff", borderColor: "#ae59ff" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Whatsapp />
              Join Whatsapp
            </a>
          </div>
        </div>
        <div className="h-full w-1/2 relative max-sm:w-full max-sm:h-48">
          <Image
            src="/image.svg"
            alt="Connect illustration"
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
};

export default Connect;
