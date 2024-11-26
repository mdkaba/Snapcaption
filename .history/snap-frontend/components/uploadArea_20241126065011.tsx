"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postImage } from "@/api/apiRequest";

export function UploadArea() {
  const [files, setFiles] = useState<File[]>([]); // State to store uploaded files
  const router = useRouter(); // Router to navigate to result page

  // Handle file upload
  const handleFileUpload = (file: File) => {
    setFiles([file]); // Store only one uploaded file
    console.log("File uploaded:", file);
  };

  // Handle caption generation
  const handleGenerateCaptions = async () => {
    if (files.length === 0) {
      console.warn("No file to upload");
      return;
    }

    try {
      const uploadResult = await postImage(files[0]); // Upload the file
      console.log("Upload to blob storage success:", uploadResult);

      const imageURL = uploadResult.image_url;

      // Navigate to the result page with the image URL as a query parameter
      router.push(`/result?img=${encodeURIComponent(imageURL)}`);
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  return (
    <div id="uploadArea" className="w-full flex flex-col gap-20 items-center">
      {/* Title and description */}
      <div className="text-center flex flex-col gap-3">
        <h2 className="font-[family-name:var(--font-libre-baskerville-b)] lg:text-4xl text-2xl text-zinc-700">
          Upload File
        </h2>
        <p className="font-[family-name:var(--font-roboto-condensed-regular)] text-zinc-600 text-xl">
          Upload an image to generate{" "}
          <span className="text-sky-700">captions</span>
        </p>
      </div>

      {/* File upload card */}
      <Card className="bg-transparent flex flex-col w-full items-center border-dashed border border-zinc-400">
        <CardContent className="w-full">
          <FileUpload onFileUpload={handleFileUpload} />
        </CardContent>
      </Card>

      {/* Generate captions button */}
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
