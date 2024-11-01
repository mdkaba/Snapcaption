import React from "react";
import { TitleSparkle } from "@/components/title";
import { UploadArea } from "@/components/uploadArea";

export default function Home() {
  return (
    <div className="bg-zinc-900 flex flex-col items-center justify-items-center min-h-screen p-8 pb-10 gap-16 sm:p-10 ">
      <TitleSparkle />
      <main className="flex flex-col gap-8 w-full items-center">
        <UploadArea />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
