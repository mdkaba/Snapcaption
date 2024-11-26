"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postImage } from "@/api/apiRequest";

export function UploadArea() {
  const [file, setFile] = useState<File | null>(null); // Store a single file
  const router = useRouter();

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    console.log("File uploaded:", uploadedFile);
  };

  const handleGenerateCaptions = async () => {
    if (!file) {
      console.warn("No file to upload");
      return;
    }

    try {
      const uploadResult = await postImage(file); // Upload the file
      console.log("Upload to blob storage success:", uploadResult);

      const imageURL = uploadResult.image_url;

      router.push(`/result?img=${encodeURIComponent(imageURL)}`);
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  return (
    <div id="uploadArea" className="w-full flex flex-col gap-20 items-center">
      <div className="text-center flex flex-col gap-3">
        <h2 className="font-[family-name:var(--font-libre-baskerville-b)] lg:text-4xl text-2xl text-zinc-700">
          Upload File
        </h2>
        <p className="font-[family-name:var(--font-roboto-condensed-regular)] text-zinc-600 text-xl">
          Upload an image to generate{" "}
          <span className="text-sky-700">captions</span>
        </p>
      </div>
      <Card className="bg-transparent flex flex-col w-full items-center border-dashed border border-zinc-400">
        <CardContent className="w-full">
          <FileUpload onChange={handleFileUpload} />
        </CardContent>
      </Card>
      <Button
        className="bg-zinc-700 hover:bg-zinc-800 font-[family-name:var(--font-libre-baskerville-b)]"
        size={"lg"}
        onClick={handleGenerateCaptions}
      >
        Generate Captions
      </Button>
    </div>
  );
}
