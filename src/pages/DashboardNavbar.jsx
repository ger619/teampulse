import { useState } from "react";

const DashboardNavBar = ({ activeTab, onTabChange, onLogout, children }) => {
  const user = JSON.parse(localStorage.getItem("pulse_current_user"));

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return "ME";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-[#FBF1E7] flex flex-col h-screen overflow-hidden">
      {/* Sticky Navbar */}
      <nav className="bg-white border-b border-green-100 px-6 py-3 flex items-center justify-between shadow-sm shrink-0 z-50">
        
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
            {/* Re-using the PulseLogo SVG inline or component */}
            <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none">
              <path
                d="M50 85C50 85 20 65 20 40C20 25 30 15 45 15C55 15 60 20 50 30C40 20 45 15 55 15C70 15 80 25 80 40C80 65 50 85 50 85Z"
                fill="#27A5A1"
              />
              <path
                d="M30 50L40 45L50 55L60 45L70 50"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M35 60L45 55L55 65L65 55L75 60"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          <span className="text-2xl font-medium text-[#5BB5A2] tracking-tight">
            Team Pulse
          </span>
        </div>

        {/* Center: Navigation Pills */}
        <div className="hidden md:flex items-center gap-2">
          {/* Check-in Tab */}
          <button
            onClick={() => onTabChange("checkin")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
              activeTab === "checkin"
                ? "bg-[#A0D6C2] text-white shadow-sm font-semibold"
                : "text-gray-500 hover:text-[#5BB5A2] font-medium"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Check-in</span>
          </button>

          {/* Team Feed Tab */}
          <button
            onClick={() => onTabChange("teamfeed")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
              activeTab === "teamfeed"
                ? "bg-[#A0D6C2] text-white shadow-sm font-semibold"
                : "text-gray-500 hover:text-[#5BB5A2] font-medium"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Team Feed</span>
          </button>
        </div>

        {/* Right: User Profile & Logout */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-right">
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-semibold text-gray-700">
                {user?.name || "Me"}
              </p>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                Member
              </p>
            </div>
            
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#A0D6C2] flex items-center justify-center text-white font-bold text-sm shadow-sm border-2 border-white ring-1 ring-gray-100">
              {getInitials(user?.name)}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="text-gray-800 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
            title="Sign Out"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </nav>
      
      <main className="flex-1 p-6 md:p-10 flex flex-col items-center overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default DashboardNavBar;