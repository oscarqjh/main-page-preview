"use client";

import React from "react";

interface TechContainerProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
}

export function TechContainer({ children, label, className = "" }: TechContainerProps) {
  return (
    <div className={`relative p-4 md:p-6 ${className}`}>
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[var(--foreground)] opacity-70" />
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-[var(--foreground)] opacity-70" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-[var(--foreground)] opacity-70" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[var(--foreground)] opacity-70" />

      {label && (
        <div className="absolute top-0 left-6 -translate-y-1/2 px-2 bg-[var(--background)]">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--foreground)] opacity-80">
            {label}
          </span>
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
