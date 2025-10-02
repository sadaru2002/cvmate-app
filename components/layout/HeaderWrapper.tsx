"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import React from "react";
import { cn } from "@/lib/utils"; // Import cn utility

const NO_HEADER_PATHS = [
  "/auth",
  "/signup",
  "/preview-download",
  "/resume-builder",
  // Removed "/user-profile" as it's no longer a dedicated page
];

export function HeaderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldShowHeader = !NO_HEADER_PATHS.some((path) => pathname.startsWith(path));

  const contentContainerClasses = cn(
    "flex flex-col flex-1", // Make this container a flex column and take available space
    shouldShowHeader ? "pt-16 min-h-[calc(100vh-64px)]" : "min-h-screen"
  );

  return (
    <>
      {shouldShowHeader && <Header />}
      <div className={contentContainerClasses}>
        {children}
      </div>
    </>
  );
}