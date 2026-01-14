import React from "react";

interface BottomNavProps {
  activeTab?: "search" | "visitors";
  onTabChange?: (tab: "search" | "visitors") => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab = "search", onTabChange }) => {
  const handleTabClick = (tab: "search" | "visitors") => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const renderNavItem = (
    id: "search" | "visitors",
    icon: string,
    label: string,
    isActive: boolean,
    iconType: "solid" | "regular" = "solid"
  ) => {
    const iconClass = iconType === "regular" ? "fa-regular" : "fa-solid";

    return (
      <button
        key={id}
        onClick={() => handleTabClick(id)}
        id={`nav-${id}`}
        className={`nav-item ${isActive ? "active" : ""} flex flex-col items-center p-2 w-20 ${
          isActive ? "text-blue-600" : "text-gray-400"
        } transition-colors group touch-manipulation`}
      >
        <div className="mb-1 p-1 rounded-full group-hover:bg-gray-50 transition-colors">
          <i className={`${iconClass} ${icon} text-xl`}></i>
        </div>
        <span className="text-[10px] font-semibold tracking-wide">{label}</span>
        <div
          className={`indicator w-1 h-1 rounded-full mt-1 ${
            isActive ? "bg-blue-600" : "bg-transparent"
          } transition-colors`}
        ></div>
      </button>
    );
  };

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full pb-2 pt-1 px-6 flex justify-around shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-40 h-[70px] safe-area-bottom">
      {renderNavItem("search", "fa-magnifying-glass", "Consultar", activeTab === "search")}

      {/* Botón FAB Central */}
      <div
        className="relative -top-8 group cursor-pointer touch-manipulation"
        onClick={() => handleTabClick("visitors")}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center shadow-lg shadow-slate-300 border-[6px] border-gray-100 transform transition-transform group-active:scale-95">
          <i className="fa-solid fa-car-side text-white text-2xl"></i>
        </div>
      </div>

      {renderNavItem("visitors", "fa-id-card", "Visitantes", activeTab === "visitors", "regular")}
    </nav>
  );
};
