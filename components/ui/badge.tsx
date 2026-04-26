"use client";

import * as React from "react";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-gray-200 ${className}`}
    >
      {children}
    </span>
  );
}