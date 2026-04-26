"use client";

import * as React from "react";

// Root Select
export function Select({
  children,
  value,
  onValueChange,
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      className="border px-3 py-2 rounded w-full bg-background"
    >
      {children}
    </select>
  );
}

// Trigger (wrapper only)
export function SelectTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

// Value (placeholder support)
export function SelectValue({
  placeholder,
}: {
  placeholder?: string;
}) {
  return <option value="">{placeholder || "Select..."}</option>;
}

// Content (wrapper)
export function SelectContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

// Item (actual option)
export function SelectItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return <option value={value}>{children}</option>;
}