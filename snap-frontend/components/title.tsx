"use client";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";

export function TitleSparkle() {
  return (
    <div className="sm:h-[30rem] h-[15rem] w-full dark:bg-zinc-900 bg-zinc-200 flex flex-col items-center sm:pt-20 pt-7 overflow-hidden rounded-md">
      <h1 className="md:text-6xl text-5xl lg:text-9xl font-bold text-center dark:text-zinc-200 text-zinc-900 relative uppercase z-20 font-[family-name:var(--font-roboto-condensed-italic)]">
        SnapCaption
      </h1>
      <div className="sm:w-[60rem] w-[40rem] sm:h-40 h-[5rem] relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] sm:w-5/6 w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px sm:w-5/6 w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] sm:w-3/6 w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px sm:w-3/6 w-1/4" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1.5}
          particleDensity={300}
          className="w-full h-full"
          particleColor="#000000"
        />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full dark:bg-zinc-900 bg-zinc-200 [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
  );
}
