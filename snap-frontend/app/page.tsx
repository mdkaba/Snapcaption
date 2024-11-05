"use client";
import React, { useRef } from "react";
import { TitleType } from "@/components/title";
import { UploadArea } from "@/components/uploadArea";
import { Navbar } from "@/components/navbar";

export default function Home() {
  // Create a reference to the upload area
  const uploadRef = useRef<HTMLDivElement | null>(null);

  // Function to scroll to the upload area
  const scrollToUpload = () => {
    if (uploadRef.current) {
      uploadRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="dark:bg-zinc-900 bg-zinc-200 relative">
      <Navbar />
      <section className="flex flex-col gap-5 items-center justify-center min-h-screen p-8 sm:p-10">
        <TitleType scrollToUpload={scrollToUpload} />
      </section>
      <section
        className="flex flex-col w-full items-center justify-center sm:px-32 min-h-screen p-10"
        ref={uploadRef}
      >
        <UploadArea />
      </section>
      {/* <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer> */}
    </div>
  );
}
