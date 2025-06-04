
"use client";

import type { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
// AppHeader is not used here as it will be part of SidebarInset content based on shadcn example
// However, if you want a global header *above* the sidebar and inset, structure would change.
// For now, assuming header is part of the main content area (SidebarInset).

export function AppSidebarLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 overflow-y-auto">
          {/* AppHeader can be rendered here by each page, or a global one if desired */}
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
