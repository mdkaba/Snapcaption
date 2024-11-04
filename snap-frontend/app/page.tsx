import React from "react";
import { TitleType } from "@/components/title";
import { UploadArea } from "@/components/uploadArea";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="dark:bg-zinc-900 bg-zinc-200">
      <Navbar />
      <div className=" flex flex-col gap-5 items-center justify-items-center min-h-screen p-8 pb-10 sm:p-10 ">
        <TitleType />
        <main className="flex flex-col w-full items-center sm:px-44">
          <UploadArea />
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
      </div>
    </div>
  );
}
