"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProcessingPage = pathname === "/checkout/processing";

  useEffect(() => {
    const preventImageDrag = (event: DragEvent) => {
      const target = event.target;

      if (
        target instanceof HTMLImageElement ||
        target instanceof SVGElement
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener("dragstart", preventImageDrag);

    return () => document.removeEventListener("dragstart", preventImageDrag);
  }, []);

  if (isProcessingPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
