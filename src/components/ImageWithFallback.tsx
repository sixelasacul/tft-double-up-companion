import { useState } from "react";

type ImageWithFallbackProps = React.ComponentProps<"img"> & {
  srcs: string[]
};

export function ImageWithFallback({ srcs, ...imgProps }: ImageWithFallbackProps) {
  const [fallbackIndex, setFallbackIndex] = useState(0)

  function loadFallback() {
    if (fallbackIndex < srcs.length - 1) {
      setFallbackIndex(prev => prev + 1)
    }
  }

  return (
    <img
      {...imgProps}
      src={srcs[fallbackIndex]}
      onError={loadFallback}
    />
  );
}
