import { useState } from "react";

const DashboardNavBar = ({ activeTab, onTabChange, onLogout, isAdmin, children }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Get user info from auth token or fallback to localStorage
  const oldUser = JSON.parse(localStorage.getItem("pulse_current_user") || "null");
  
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

  const handleLogoutClick = async () => {
    setIsLoggingOut(true);
    try {
      await onLogout();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="bg-[#FBF1E7] flex flex-col h-screen overflow-hidden">
      {/* Sticky Navbar */}
      <nav className="bg-white border-b border-green-100 px-6 py-3 flex items-center justify-between shadow-sm shrink-0 z-50">
        
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
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
          {/* Dashboard Tab */}
          <button
            onClick={() => onTabChange("dashboard")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
              activeTab === "dashboard"
                ? "bg-[#A0D6C2] text-white shadow-sm font-semibold"
                : "text-gray-500 hover:text-[#5BB5A2] font-medium"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Dashboard</span>
          </button>

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

          {/* Admin Tab - Only visible for staff */}
          {isAdmin && (
            <button
              onClick={() => onTabChange("admin")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
                activeTab === "admin"
                  ? "bg-purple-500 text-white shadow-sm font-semibold"
                  : "text-gray-500 hover:text-purple-600 font-medium"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Admin</span>
            </button>
          )}
        </div>

        {/* Right: User Profile & Logout */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-right">
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-semibold text-gray-700">
                {oldUser?.name || "Welcome!"}
              </p>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                {oldUser?.team ? `${oldUser.team} • Member` : "Team Member"}
              </p>
            </div>
            
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#A0D6C2] flex items-center justify-center text-white font-bold text-sm shadow-sm border-2 border-white ring-1 ring-gray-100">
              {getInitials(oldUser?.name)}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            className={`text-gray-800 transition-colors p-1 rounded-md ${
              isLoggingOut 
                ? "text-gray-400 cursor-not-allowed" 
                : "hover:text-red-500 hover:bg-red-50"
            }`}
            title={isLoggingOut ? "Logging out..." : "Sign Out"}
          >
            {isLoggingOut ? (
              <svg className="animate-spin h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 flex flex-col items-center overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default DashboardNavBar;