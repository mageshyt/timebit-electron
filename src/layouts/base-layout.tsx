import type React from "react";
import DragWindowRegion from "@/components/drag-window-region";
import SystemHeader from "@/components/system-header";
import SystemFooter from "@/components/system-footer";
import AppSidebar from "@/components/app-sidebar";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full flex-col bg-[#131315] font-sans text-[#e4e4e6] selection:bg-[#c0c1ff]/30">
      {/* Drag Region — must span full width above everything */}
      <DragWindowRegion />

      {/* System Header */}
      <SystemHeader />

      {/* Body: sidebar + main content */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <main className="flex-1 min-h-0 overflow-y-auto relative">
          {children}
        </main>
      </div>

      {/* System Footer */}
      <SystemFooter />
    </div>
  );
}
