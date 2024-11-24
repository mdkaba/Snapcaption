"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postImage, generateCaption } from "@/api/apiRequest";

export function UploadArea() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  const handleGenerateCaptions = async () => {
    if (files.length === 0) {
      console.warn("No file to upload");
      return;
    }

    try {
      const uploadResult = await postImage(files[0]); // Upload the first file
      console.log("Upload to blob storage success:", uploadResult);

      const imageURL = uploadResult.image_url;
      // console.log("Image URL:", imageURL);

      // Call the generate caption API
      // const captionResult = await generateCaption(imageURL);
      // console.log("Caption generation success:", captionResult);

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
          <span className="text-sky-700"> captions</span>{" "}
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
