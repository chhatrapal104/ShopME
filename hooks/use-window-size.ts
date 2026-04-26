import { useEffect, useState } from "react";

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

/**
 * Returns the current window dimensions.
 * Returns undefined during SSR to avoid hydration mismatches.
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
