import { useState } from "react";
import { useSelector } from "react-redux";
import DashboardNavBar from "./DashboardNavbar";
import DashboardHome from "./DashboardHome";
import CheckInPage from "./CheckInPage";
import AdminPanel from "./AdminPanel";
import TeamFeedView from "./TeamFeedView";

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user } = useSelector((state) => state.logIn);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome />;
      case "checkin":
        return <CheckInPage />;
      case "admin":
        return <AdminPanel />;
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
      onLogout={onLogout}
      isAdmin={user?.is_staff}
    >
      {renderContent()}
    </DashboardNavBar>
  );
};

export default Dashboard;