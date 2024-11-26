import { TextGenerateEffect } from "./ui/text-generate-effect";

export function ResultText({ captions }: { captions: string }) {
  return (
    <div>
      <TextGenerateEffect words={captions} />
    </div>
  );
}
