import Image from "next/image";

const ExploreLC = () => {
  return (
    <div
      className="flex items-center justify-center w-full px-[5vw] flex-wrap max-sm:pb-[5vh]"
      style={{
        backgroundImage: 'url("/bg-explorelc.svg")',
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="w-1/2 max-md:w-4/5 max-sm:w-4/5 relative h-80"
        style={{ minWidth: "300px" }}
      >
        <Image
          src="/explorelc.svg"
          alt="Explore Learning Circles"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div
        className="flex flex-col w-1/2 max-md:w-full max-md:min-w-75 mt-7.5 mb-10 max-md:gap-[2vh] gap-[4vh] items-center text-center"
        style={{ minWidth: "400px" }}
      >
        <h1
          className="max-md:text-[28px] text-[35px]"
          style={{ color: "#ae59ff" }}
        >
          Explore Learning Circles
        </h1>
        <p className="max-md:text-base max-sm:text-xs text-[18px]">
          An informal mechanism for bringing together learners who are
          interested in the same topic from across different fields and
          disciplines. A fantastic way to spend a small amount of time learning
          about new things with a group of people with same interests!
        </p>
        <a
          target="_blank"
          href="https://app.mulearn.org/learning-circle"
          className="text-white rounded-lg px-5 py-2.5 w-fit font-normal"
          style={{ backgroundColor: "#ae59ff" }}
          rel="noopener noreferrer"
        >
          Create/Join Learning Circles
        </a>
      </div>
    </div>
  );
};

export default ExploreLC;
