import { useState } from "react";
import DashboardNavBar from "./DashboardNavbar";
import CheckInView from "./CheckInView";
import TeamFeedView from "./TeamFeedView";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("checkin");

  const handleLogout = () => {
    localStorage.removeItem("pulse_current_user");
    window.location.href = "/";
  };

  return (
    <DashboardNavBar 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      {activeTab === "checkin" ? (
        <CheckInView />
      ) : (
        <TeamFeedView />
      )}
    </DashboardNavBar>
  );
}

export default Dashboard;