"use client";

import React, { useState, ReactNode } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

interface AdminLayoutProps {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  userIcon?: string;
  initialTab?: "search" | "visitors";
  onTabChange?: (tab: "search" | "visitors") => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title = "Control PH",
  subtitle = "Torres del Parque",
  userIcon = "fa-user-shield",
  initialTab = "search",
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<"search" | "visitors">(initialTab);

  const handleTabChange = (tab: "search" | "visitors") => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="admin-layout flex flex-col h-screen w-full">
      {/* Header */}
      <Header title={title} subtitle={subtitle} userIcon={userIcon} />

      {/* Content Area (Slot para vistas) */}
      <main className="flex-1 overflow-y-auto hide-scroll relative p-4 pb-32 w-full bg-gray-100">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Toast (componente global) */}
      <div
        id="toast"
        className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-gray-800/95 backdrop-blur text-white px-6 py-3 rounded-full shadow-2xl z-[60] transition-all duration-300 opacity-0 pointer-events-none flex items-center gap-3 translate-y-[-20px] w-max max-w-[90%]"
      >
        <i id="toastIcon" className="fa-solid fa-circle-check text-green-400"></i>
        <span id="toastMsg" className="font-medium text-sm truncate">
          Mensaje
        </span>
      </div>
    </div>
  );
};
