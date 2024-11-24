"use client";
import { useSearchParams } from "next/navigation"; // useSearchParams hook to read URL parameters
import { useEffect, useState } from "react";
import { generateCaption } from "@/api/apiRequest"; // API call to generate captions
import { ResultText } from "@/components/resultText";

const ResultPage = () => {
  const searchParams = useSearchParams(); // Get search params from the URL
  const [captions, setCaptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const imageURL = searchParams.get("img"); // Access the "img" query parameter

    if (imageURL) {
      const fetchCaptions = async () => {
        try {
          // Generate captions using the image URL
          const captionResult = await generateCaption(imageURL);
          console.log("Caption generation success:", captionResult);
          const extractedCaptions =
            captionResult?.denseCaptionsResult?.values?.map(
              (item: any) => item.text
            ) || [];
          console.log(extractedCaptions);
          setCaptions(extractedCaptions);
          setLoading(false);
        } catch (error) {
          console.error("Failed to generate caption:", error);
          setLoading(false);
        }
      };

      fetchCaptions();
    }
  }, [searchParams]);

  return (
    <div>
      <h1>Generated Captions</h1>
      {loading ? (
        <p>Loading captions...</p>
      ) : captions.length > 0 ? (
        <ResultText captions={captions} />
      ) : (
        <p>No captions available</p>
      )}
    </div>
  );
};

export default ResultPage;
