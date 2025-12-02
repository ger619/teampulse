import { useState } from "react";
import DashboardNavBar from "./DashboardNavbar";
import DashboardHome from "./DashboardHome";
import CheckInPage from "./CheckInPage";

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome />;
      case "checkin":
        return <CheckInPage />; // Add this case
      case "teamfeed":
        return (
          <div className="w-full max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Team Feed</h1>
            <p className="text-gray-600">Team feed content will go here...</p>
          </div>
        );
      default:
        return <DashboardHome />;
    }
  };

  return (
    <DashboardNavBar 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardNavBar>
  );
};

export default Dashboard;