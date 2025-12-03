import { useState } from "react";
import { useSelector } from "react-redux";
import MoodManagement from "./admin/MoodManagement";
import WorkloadManagement from "./admin/WorkloadManagement";
import TeamManagement from "./admin/TeamManagement";
import UserManagement from "./admin/UserManagement";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("moods");
  const { user } = useSelector((state) => state.logIn);

  // Check if user is admin
  if (!user?.is_staff) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-20">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">You do not have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "moods", label: "Moods", icon: "😊" },
    { id: "workloads", label: "Workloads", icon: "💼" },
    { id: "teams", label: "Teams", icon: "👥" },
    { id: "users", label: "Users", icon: "👤" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "moods":
        return <MoodManagement />;
      case "workloads":
        return <WorkloadManagement />;
      case "teams":
        return <TeamManagement />;
      case "users":
        return <UserManagement />;
      default:
        return <MoodManagement />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#A0D6C2] to-[#27A5A1] rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="opacity-90">Manage moods, workloads, teams, and users</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-md p-2">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-[#A0D6C2] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;
