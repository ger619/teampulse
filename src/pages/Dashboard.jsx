import { useState } from "react";
import DashboardNavBar from "./DashboardNavbar";
import DashboardHome from "./DashboardHome";
import CheckInView from "./CheckInView";
import TeamFeedView from "./TeamFeedView";

const Dashboard = () => {
  // Set the default active tab to 'dashboard' since it is the new landing page
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome />;
      case "checkin":
        return <CheckInView />;
      case "teamfeed":
        return <TeamFeedView />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <DashboardNavBar 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      {renderContent()}
    </DashboardNavBar>
  );
}

export default Dashboard;