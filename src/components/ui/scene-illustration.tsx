"use client";

import { useMemo } from "react";
import { generateIllustrationDataUri } from "@/lib/illustrations";

interface SceneIllustrationProps {
  topic: string;
  width?: number;
  height?: number;
  className?: string;
}

export function SceneIllustration({
  topic,
  width = 400,
  height = 250,
  className = "",
}: SceneIllustrationProps) {
  const src = useMemo(
    () => generateIllustrationDataUri(topic, width, height),
    [topic, width, height]
  );

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={width}
      height={height}
      className={`rounded-lg ${className}`}
      role="presentation"
    />
  );
}
