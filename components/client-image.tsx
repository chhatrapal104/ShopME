"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ClientImageProps {
  src: string;
  alt: string;
  className?: string;
  productId?: number;
}

/**
 * A client-side image component with two-level fallback:
 *   1. Primary: picsum.photos (real photo, seeded by productId)
 *   2. Fallback: placehold.co (colored tile — always works, no redirect)
 *
 * Using plain <img> (not next/image) so Vercel's image-optimization proxy
 * is never involved.
 */
export function ClientImage({ src, alt, className, productId = 1 }: ClientImageProps) {
  const fallback = `https://placehold.co/400x400/6366f1/ffffff?text=Product`;
  const [imgSrc, setImgSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      className={cn("w-full h-full object-cover", className)}
      onError={() => {
        if (!failed) {
          setFailed(true);
          setImgSrc(fallback);
        }
      }}
    />
  );
}
