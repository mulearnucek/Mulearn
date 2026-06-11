"use client";
import { useEffect, useState } from "react";
import { ULearn } from "../../assets/svg/svg";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import data from "../../../data.json";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [openmenu, setopenmenu] = useState(false);
  const [navbg, setNavBg] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const pathname = usePathname();

  const navItems = [
    { label: "home", path: "/#home" },
    { label: "about", path: "/#about" },
    { label: "achievements", path: "/#achievements" },
    { label: "gallery", path: "/#gallery" },
    { label: "team", path: "/team" },
    { label: "contact", path: "/#contact" },
  ];

  const changeNavBg = () => {
    setNavBg(window.scrollY >= 150);
  };

  useEffect(() => {
    const initHash = () => setCurrentHash(window.location.hash);
    initHash();

    window.addEventListener("scroll", changeNavBg);
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("scroll", changeNavBg);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const isItemActive = (item: { label: string; path: string }) => {
    if (item.label === "team") {
      return pathname === "/team";
    }
    if (pathname === "/") {
      if (
        item.label === "home" &&
        (currentHash === "" || currentHash === "#home")
      ) {
        return true;
      }
      return currentHash.includes(item.label);
    }
    return false;
  };

  return (
    <div
      className="fixed w-full flex items-center justify-between py-[5px] bg-transparent z-[9999] backdrop-blur-[8px] top-0"
      style={{
        background: navbg ? "rgba(255,255,255,0.4)" : "transparent",
      }}
    >
      {/* Left Section */}
      <div className=" mt-[-10px] w-fit h-fit">
        <Link
          href="/#home"
          className="w-fit mt-[4vh] mb-[13px] ml-[35px] h-fit flex flex-col items-end justify-end text-black font-normal"
        >
          <ULearn />
          <p className="text-[18px] font-[800] mt-[-15px] text-[#9042EB] uppercase">
            {data.collegeCode}
          </p>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center mb-3 gap-[4vh] px-[35px] bg-transparent justify-center w-fit">
        <div className="flex gap-[5vh] items-center justify-center">
          {navItems.map((item, i) => (
            <Link
              href={item.path}
              key={i.toString() + item.label}
              className="text-black font-normal capitalize"
            >
              <p
                style={{
                  borderBottom: isItemActive(item) ? "4px solid #B3B3FF" : "",
                  height: "18px",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                {item.label}
              </p>
            </Link>
          ))}
        </div>
        <button className="bg-none border-none p-0">
          <a
            target="_blank"
            href="http://app.mulearn.org/register"
            rel="noopener noreferrer"
            className="px-[10px] py-[10px] h-[5vh] w-[15vh] rounded-[5px] text-white bg-[#6f6fff] font-normal hover:opacity-90 transition-opacity text-[13px] flex items-center justify-center"
          >
            Join µlearn
          </a>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-[5vh] px-[35px] bg-transparent">
        <button
          onClick={() => setopenmenu(!openmenu)}
          className="text-[30px] bg-none border-none cursor-pointer text-black hover:text-[#ae59ff] transition-colors ml-auto
                    mt-[-1vh] mb-[13px]"
          aria-label="Toggle menu"
        >
          {openmenu ? <AiOutlineClose /> : <AiOutlineMenu />}
        </button>
        {openmenu && (
          <div className="fixed top-[20px] right-[75px] bg-[rgba(0,0,0,0.7)] z-[9999] backdrop-blur-[8px] p-[10px] rounded-[10px] flex flex-col items-center gap-[5px] h-[40vh] w-[50vw] justify-between md:hidden">
            {navItems.map((item, i) => (
              <Link
                href={item.path}
                key={i.toString() + item.label}
                onClick={() => setopenmenu(false)}
              >
                <p
                  style={{
                    textDecoration: isItemActive(item)
                      ? "4px solid #B3B3FF underline"
                      : "",
                    height: "18px",
                    color: "white",
                    fontSize: "20px",
                    fontWeight: 400,
                    textTransform: "capitalize",
                  }}
                >
                  {item.label}
                </p>
              </Link>
            ))}
            <button className="bg-none border-none p-0">
              <a
                href="http://app.mulearn.org/register"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setopenmenu(false)}
                className="text-white font-normal px-[15px] h-[5vh] w-[15vh] rounded-[5px] bg-[#6f6fff] hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                Join µlearn
              </a>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
