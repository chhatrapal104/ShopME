"use client";

import * as React from "react";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary" | "outline";
};

export function Badge({
  children,
  className = "",
  variant = "default",
}: BadgeProps) {
  let baseStyle =
    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium";

  let variantStyle = "";

  switch (variant) {
    case "secondary":
      variantStyle = "bg-gray-200 text-gray-800";
      break;
    case "outline":
      variantStyle = "border border-gray-300 text-gray-800";
      break;
    default:
      variantStyle = "bg-gray-800 text-white";
  }

  return (
    <span className={`${baseStyle} ${variantStyle} ${className}`}>
      {children}
    </span>
  );
}