
"use client";
import { Loader2 } from "lucide-react";

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
