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

// Trigger (NOW accepts className)
export function SelectTrigger({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

// Value
export function SelectValue({
  placeholder,
}: {
  placeholder?: string;
}) {
  return <option value="">{placeholder || "Select..."}</option>;
}

// Content
export function SelectContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

// Item
export function SelectItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return <option value={value}>{children}</option>;
}