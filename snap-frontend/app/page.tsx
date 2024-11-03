import React from "react";
import { TitleSparkle } from "@/components/title";
import { UploadArea } from "@/components/uploadArea";

export default function Home() {
  return (
    <div className="dark:bg-zinc-900 bg-zinc-200 flex flex-col items-center justify-items-center min-h-screen p-8 pb-10 sm:p-10 ">
      <TitleSparkle />
      <main className="flex flex-col w-full items-center sm:px-44">
        <UploadArea />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
