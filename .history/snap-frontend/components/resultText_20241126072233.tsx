import { TextGenerateEffect } from "./ui/text-generate-effect";

export function ResultText({ captions }: { captions: string }) {
  return (
    <div className="text-3xl font-[family-name:var(--font-roboto-condensed-regular)]">
      <TextGenerateEffect words={captions} />
    </div>
  );
}

