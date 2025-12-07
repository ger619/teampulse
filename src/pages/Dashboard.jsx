import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import DashboardNavBar from "./DashboardNavbar";
import DashboardHome from "./DashboardHome";
import CheckInPage from "./CheckInPage";
import AdminPanel from "./AdminPanel";
import TeamFeedView from "./TeamFeedView";

const Dashboard = ({ onLogout }) => {
  const { user } = useSelector((state) => state.logIn);
  const isAdmin = !!user?.is_staff;
  const defaultTab = useMemo(() => (isAdmin ? "dashboard" : "checkin"), [isAdmin]);
  const [activeTab, setActiveTab] = useState(defaultTab);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome />;
      case "checkin":
        return <CheckInPage onNavigateTab={handleTabChange} />;
      case "admin":
        return <AdminPanel />;
      case "teamfeed":
        return <TeamFeedView />;
      default:
        return <DashboardHome />;
    }
  };

  const handleTabChange = (tab) => {
    if (!isAdmin && tab === "dashboard") {
      return; // block access to dashboard for non-admin
    }
    if (!isAdmin && tab === "admin") {
      return; // block admin panel for non-admin
    }
    setActiveTab(tab);
  };

  // Guard: auto-redirect non-admins away from restricted tabs
  useEffect(() => {
    if (!isAdmin && (activeTab === "dashboard" || activeTab === "admin")) {
      setActiveTab("checkin");
    }
  }, [isAdmin, activeTab]);

  return (
    <DashboardNavBar 
      activeTab={activeTab} 
      onTabChange={handleTabChange} 
      onLogout={onLogout}
      isAdmin={isAdmin}
    >
      {renderContent()}
    </DashboardNavBar>
  );
};

export default Dashboard;