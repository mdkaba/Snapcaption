import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 0,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

const MAX_FILE_SIZE_MB = 10;

const ALLOWED_FILE_TYPES = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
];

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [hoveredFileIndex, setHoveredFileIndex] = useState<number | null>(null); // Track which file is hovered
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.warning("Uh oh! Something went wrong...", {
          description: (
            <div style={{ color: "#9b2c2c", fontSize: 16 }}>
              <p>Invalid file type.</p>
              <p>Please upload jpg, jpeg, png, or svg files.</p>
            </div>
          ),
          className:
            "text-lg font-[family-name:var(--font-roboto-condensed-regular)] gap-5 p-5",
          style: {
            backgroundColor: "#ffe4e6",
            borderColor: "#fecdd3",
            color: "#9b2c2c",
          },
        });
        return false;
      } else if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.warning("Uh oh! Something went wrong...", {
          description: (
            <div style={{ color: "#9b2c2c", fontSize: 16 }}>
              <p>File size too large.</p>
              <p>File size exceeds 10MB.</p>
            </div>
          ),
          className:
            "text-lg font-[family-name:var(--font-roboto-condensed-regular)] gap-5 p-5",
          style: {
            backgroundColor: "#ffe4e6",
            borderColor: "#fecdd3",
            color: "#9b2c2c",
          },
        });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
      onChange && onChange(validFiles); // Notify parent component of valid file changes
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (fileIndex: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, idx) => idx !== fileIndex));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="sm:px-10 px-5 sm:py-14 py-7 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept="image/jpg, image/jpeg, image/png, image/svg+xml"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-bold text-zinc-700 dark:text-zinc-300 sm:text-2xl text-base text-center font-[family-name:var(--font-libre-baskerville-b)]">
            Drag or drop your image here or click to upload
          </p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  whileHover={{
                    scale: 1.03,
                    transition: {
                      type: "spring",
                      stiffness: 300, // Higher stiffness for a bouncier effect
                      damping: 20, // Lower damping for more bounce
                    },
                  }}
                  className={cn(
                    "relative overflow-hidden z-40 bg-zinc-100 dark:bg-zinc-800 flex flex-col items-start justify-start md:h-fit p-7 mt-4 w-full mx-auto rounded-md",
                    "shadow-sm"
                  )}
                  onMouseEnter={() => setHoveredFileIndex(idx)} // Set hover on file
                  onMouseLeave={() => setHoveredFileIndex(null)} // Remove hover when mouse leaves
                >
                  <div className="flex justify-between w-full items-center gap-4 mt-2 font-[family-name:var(--font-roboto-condensed-regular)]">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-base text-zinc-700 dark:text-zinc-300 truncate max-w-xs"
                    >
                      {file.name}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-white shadow-input"
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>

                  <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-zinc-600 dark:text-zinc-400 font-[family-name:var(--font-roboto-condensed-regular)]">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="px-1.5 py-1 rounded-md bg-zinc-200 dark:bg-neutral-800 "
                    >
                      {file.type}
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      modified{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>
                  {/* Remove button appears when hovered */}
                  {hoveredFileIndex === idx && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="absolute top-0 right-0 pr-2 pt-2 cursor-pointer text-rose-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(idx);
                      }} // Remove file on click
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-x-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11.742 4.258a1 1 0 0 0-1.414 0L8 6.586 5.672 4.258a1 1 0 0 0-1.414 1.414L6.586 8 4.258 10.328a1 1 0 0 0 1.414 1.414L8 9.414l2.328 2.328a1 1 0 0 0 1.414-1.414L9.414 8l2.328-2.328a1 1 0 0 0 0-1.414z" />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-zinc-100 dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-zinc-600 flex flex-col items-center font-[family-name:var(--font-roboto-condensed-regular)]"
                  >
                    Drop it
                    <IconUpload className="h-6 w-6 text-zinc-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-6 w-6 text-zinc-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-sky-600 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              ></motion.div>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-8 items-center sm:text-base text-xs">
            <p className="relative z-20 font-[family-name:var(--font-roboto-condensed-regular)] font-normal text-neutral-400 dark:text-zinc-400  ">
              * Supported formats: jpg, jpeg, png, svg.
            </p>
            <p className="relative z-20 font-[family-name:var(--font-roboto-condensed-regular)] font-normal text-neutral-400 dark:text-zinc-400">
              * Maximum file size: 10MB
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
