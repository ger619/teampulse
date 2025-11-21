import { useState } from "react";

const DashboardNavBar = ({ onLogout, children }) => {
  const [activeTab, setActiveTab] = useState("checkin");
  const user = JSON.parse(localStorage.getItem("pulse_current_user"));

  return (
    <div className="bg-[#FBF1E7] flex flex-col">

      {/* Sticky Navbar */}
      <nav className="bg-white border-b border-green-200 shadow-sm sticky top-0 z-50">
        <div className="px-4 py-3 flex justify-between items-center">

          {/* Left side */}
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <svg className="w-7 h-7" viewBox="0 0 100 100" fill="none">
                <path d="M50 85C50 85 20 65 20 40C20 25 30 15 45 15C55 15 60 20 50 30C40 20 45 15 55 15C70 15 80 25 80 40C80 65 50 85 50 85Z" fill="#27A5A1"/>
                <path d="M30 50L40 45L50 55L60 45L70 50" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <span className="text-lg font-semibold text-[#27A5A1]">
                Team Pulse
              </span>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("checkin")}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  activeTab === "checkin"
                    ? "bg-white shadow text-[#27A5A1]"
                    : "text-gray-600"
                }`}
              >
                Check-in 📝
              </button>
              <button
                onClick={() => setActiveTab("teamfeed")}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  activeTab === "teamfeed"
                    ? "bg-white shadow text-[#27A5A1]"
                    : "text-gray-600"
                }`}
              >
                Team Feed 👥
              </button>
            </div>
          </div>

          {/* User & Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-right leading-tight">
              <div className="text-sm font-medium text-gray-900">
                {user?.name} 👤
              </div>
              <div className="text-xs text-gray-500">
                {user?.team} • Member
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

        </div>
      </nav>

      {/* Main content area – compact, centered, original style */}
      <main className="w-full max-w-md mx-auto px-4 py-6 flex-grow">
        {children}
      </main>
    </div>
  );
};

export default DashboardNavBar;
