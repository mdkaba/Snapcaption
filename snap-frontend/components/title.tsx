"use client";
import React from "react";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface TitleTypeProps {
  scrollToUpload: () => void;
}

export function TitleType({ scrollToUpload }: TitleTypeProps) {
  const words = `Turn your images into captivating stories in seconds`;
  return (
    <div className="h-fit w-fit text-zinc-700 dark:bg-zinc-900 bg-zinc-200 flex flex-col sm:gap-7 gap-5 items-center sm:pt-20 py-7 overflow-hidden rounded-md font-[family-name:var(--font-libre-baskerville-b)]">
      <TextGenerateEffect words={words} />
      <p className="text-zinc-600 dark:text-zinc-200 text-sm sm:text-2xl font-light font-[family-name:var(--font-roboto-condensed-regular)] lg:w-[50rem] w-[20rem] text-center">
        Easily upload images, and let SnapCaption generate meaningful captions,
        helping you create stunning visuals for your website, social media, or
        presentations.
      </p>
      <Button
        onClick={scrollToUpload}
        className="bg-zinc-700 hover:bg-zinc-800"
      >
        Try it for free
        <ArrowRight />
      </Button>
    </div>
  );
}
