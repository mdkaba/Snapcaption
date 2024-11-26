"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { IconUpload } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

type FileUploadProps = {
  onFileUpload: (file: File) => void;
};

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast.error("No file selected!");
      return;
    }
    const file = acceptedFiles[0];
    setFileName(file.name);
    onFileUpload(file);
    toast.success("File uploaded successfully!");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },
    maxFiles: 1,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
    onDropRejected: () => {
      toast.error("Invalid file type or size. Please upload a valid image.");
      setIsDragging(false);
    },
  });

  const handleManualUpload = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
        isDragging ? "border-sky-600 bg-sky-50" : "border-zinc-400"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4 h-72">
        <motion.div
          className="text-sky-600 "
          animate={{ scale: isDragging ? 1.2 : 1 }}
        >
          <IconUpload size={48} />
        </motion.div>
        <p className="text-zinc-600">
          {fileName ? (
            <>
              File Selected: <span className="font-bold">{fileName}</span>
            </>
          ) : (
            "Drag and drop a file here or click to upload"
          )}
        </p>
        <Button
          className="bg-sky-600 hover:bg-sky-700"
          onClick={handleManualUpload}
        >
          Browse Files
        </Button>
      </div>
    </div>
  );
};
