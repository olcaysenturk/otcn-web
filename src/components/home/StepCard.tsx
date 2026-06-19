"use client";

import Image from "next/image";
import { useState } from "react";
import type { StepCardProps } from "@/types/home";

export function StepCard({
  number,
  title,
  description,
  status,
  imageSrc,
}: StepCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative flex h-full flex-col rounded-4xl border border-transparent bg-transparent p-4 transition-all duration-300 hover:border-transparent hover:bg-[#f6f7f9] hover:text-black hover:shadow-[0_25px_80px_rgba(0,0,0,0.24)]  md:p-6 cursor-pointer justify-end"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex flex-col gap-3 text-center md:text-left">
        <span className="text-4xl font-semibold text-slate-900 transition-colors duration-300 group-hover:text-black ">
          {number}
        </span>
        <h3 className="text-xl font-semibold text-slate-900 transition-colors duration-300 group-hover:text-black ">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-700 transition-colors duration-300 group-hover:text-black ">
          {description}
        </p>
      </div>
      <div
        className={`relative mt-8 w-full overflow-hidden transition-[height] duration-300 ease-out bg-gray-50 ${
          hovered || status ? "flex flex-col gap-3 text-center md:text-left" : ""
        }`}
        style={{ height: hovered || status ? "12rem" : 0 }}
      >
        <div
          className={`pointer-events-none absolute inset-0 rounded-2xl border border-slate-300/30 bg-[linear-gradient(90deg,rgba(148,163,184,0.14)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.14)_1px,transparent_1px)] transition-opacity duration-300 ${
            hovered || status ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            hovered || status ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={imageSrc}
            alt=""
            width={200}
            height={160}
            className="h-32 w-auto opacity-90"
          />
        </div>
      </div>
    </div>
  );
}
