import React from "react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  userIcon?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = "Control PH",
  subtitle = "Torres del Parque",
  userIcon = "fa-user-shield",
}) => {
  return (
    <header className="bg-slate-800 text-white p-4 shadow-md z-30 flex justify-between items-center shrink-0 h-[60px]">
      <div>
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="text-[10px] text-slate-400">{subtitle}</p>
      </div>
      <div className="h-8 w-8 bg-slate-700 rounded-full flex items-center justify-center border border-slate-600 cursor-pointer hover:bg-slate-600 transition-colors">
        <i className={`fa-solid ${userIcon} text-xs`}></i>
      </div>
    </header>
  );
};
