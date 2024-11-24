import { TextGenerateEffect } from "./ui/text-generate-effect";

export function ResultText({ captions }: { captions: any[] }) {
  return (
    <div>
      {captions.map((caption, index) => (
        <TextGenerateEffect key={index} words={caption} />
      ))}
    </div>
  );
}
