"use client";

import { useRouter } from "next/navigation";
import { type Execom } from "@/lib/notion-team";
import { useState } from "react";

export default function ExecomSwitcher({
  execoms,
  currentExecomId,
}: {
  execoms: Execom[];
  currentExecomId?: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (!execoms || execoms.length === 0) return null;

  return (
    <div className="flex flex-col items-center mt-20 w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-8 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm font-black uppercase tracking-widest text-gray-400 hover:text-[#ad58ff] hover:border-[#ad58ff]/20 hover:bg-[#ad58ff]/5 transition-all group"
      >
        <span>View Previous Execoms</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out w-full flex justify-center ${
          isOpen ? "max-h-96 opacity-100 mt-10" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-wrap gap-4 justify-center pb-10">
          {execoms.map((ex) => {
            const isActive = ex.id === currentExecomId;
            return (
              <button
                key={ex.id}
                onClick={() => router.push(`?execom=${ex.id}`)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-[#ad58ff] text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {ex.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
