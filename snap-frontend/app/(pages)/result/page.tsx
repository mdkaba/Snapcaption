"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation"; // useSearchParams hook to read URL parameters
import { useEffect, useState } from "react";
import {
  generateCaption,
  generateDescriptiveCaption,
  storeCaption,
  getCaptions,
} from "@/api/apiRequest"; // API call to generate captions
import { ResultText } from "@/components/resultText";
import { LoadingSpinner } from "@/components/spinner";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const ResultPage = () => {
  const searchParams = useSearchParams(); // Get search params from the URL
  const [captions, setCaptions] = useState<string>(""); // State to store captions
  const [loading, setLoading] = useState(true);
  const [captionHistory, setCaptionHistory] = useState<any[]>([]);

  const image: string = searchParams.get("img") || "";

  const fetchCaptionHistory = () => {
    getCaptions()
      .then((history) => {
        setCaptionHistory(history?.captions || []);
      })
      .catch((error) => {
        console.error("Failed to fetch caption history:", error);
      });
  };

  useEffect(() => {
    const imageURL = searchParams.get("img");

    if (imageURL) {
      const fetchAndStoreCaptions = async () => {
        try {
          // Generate captions using the image URL
          const captionResult = await generateCaption(imageURL);
          const captionArray =
            captionResult?.denseCaptionsResult?.values?.map(
              (item: any) => item.text
            ) || [];

          const captionText = await generateDescriptiveCaption(captionArray);
          console.log("Caption generated successfully:", captionText);

          setCaptions(captionText?.refined_caption);
          setLoading(false);
          if (captionText?.refined_caption) {
            storeCaption(captionText)
              .then((storeResponse) => {
                console.log("Caption stored successfully:", storeResponse);
                fetchCaptionHistory(); // Fetch captions after storing
              })
              .catch((error) => {
                console.error("Failed to store caption:", error);
              });
          }
        } catch (error) {
          console.error("Failed to generate and store caption:", error);
          setLoading(false);
        }
      };

      fetchAndStoreCaptions();
    }
  }, [searchParams]);

  return (
    <div className="dark:bg-zinc-900 bg-zinc-200 relative w-full py-10 px-5">
      {loading ? (
        <section className="w-full h-full flex items-center min-h-screen">
          <LoadingSpinner size={64} className="text-sky-700 w-full" />
        </section>
      ) : captions.length > 0 ? (
        <section className="w-full flex flex-col items-center justify-center min-h-screen p-12 gap-12">
          <h1 className="font-[family-name:var(--font-libre-baskerville-b)] lg:text-4xl text-2xl text-zinc-700 text-center w-full">
            Result
          </h1>
          <div className="rounded-lg border border-zinc-400 w-fit h-fit flex items-center p-10 gap-10">
            <div className="w-full flex justify-center">
              <Image
                src={image}
                width={500}
                height={400}
                alt="image uploaded by user"
                className="rounded-lg"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
            <Separator orientation="vertical" className="h-96 bg-zinc-300" />
            <div className="w-full p-2 text-wrap">
              <ResultText captions={captions} />
            </div>
          </div>
          <Button
            className="bg-zinc-700 hover:bg-zinc-800 font-[family-name:var(--font-libre-baskerville-b)]"
            size={"lg"}
            onClick={() => (window.location.href = "/#uploadArea")}
          >
            Retry
          </Button>
          <div className="w-full mt-12">
            <h2 className="text-2xl font-bold text-zinc-700 mb-4 font-[family-name:var(--font-libre-baskerville-b)] text-center">
              Caption History
            </h2>
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse border border-zinc-400 w-full text-sm rounded-lg overflow-hidden">
                <thead className="bg-zinc-300">
                  <tr>
                    <th className="border border-zinc-200 px-4 py-2 text-left">
                      ID
                    </th>
                    <th className="border border-zinc-200 px-4 py-2 text-left">
                      Refined Caption
                    </th>
                    <th className="border border-zinc-200 px-4 py-2 text-left">
                      Sentences
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {captionHistory.map((caption, index) => (
                    <tr
                      key={caption.id || index}
                      className={`${
                        index % 2 === 0 ? "bg-zinc-100" : "bg-zinc-200"
                      }`}
                    >
                      <td className="border border-zinc-400 px-4 py-2">
                        {caption.id}
                      </td>
                      <td className="border border-zinc-400 px-4 py-2">
                        {caption.refined_caption}
                      </td>
                      <td className="border border-zinc-400 px-4 py-2">
                        <ul>
                          {caption.sentences.map(
                            (sentence: string, i: number) => (
                              <li key={i}>{sentence}</li>
                            )
                          )}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : (
        <section className="w-full h-full flex flex-col items-center justify-center min-h-screen p-12 gap-24">
          <p className="text-2xl font-[family-name:var(--font-roboto-condensed-regular)]">
            No caption generated
          </p>
        </section>
      )}
    </div>
  );
};

const SuspenseWrapper = () => (
  <Suspense
    fallback={<LoadingSpinner size={64} className="text-sky-700 w-full" />}
  >
    <ResultPage />
  </Suspense>
);

export default SuspenseWrapper;
