"use client";

import QueryWrapper from "@/components/QueryWrapper";
import AppContent from "./AppContent";

export default function Home() {
  return (
    <QueryWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AppContent />
      </div>
    </QueryWrapper>
  );
}
