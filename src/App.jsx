import { useEffect, useState } from "react";
import Home from "./Home";
import Dashboard from "./pages/Dashboard";
import DashboardNavBar from "./pages/DashboardNavbar";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("pulse_current_user"));
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("pulse_current_user");
    setCurrentUser(null);
  };

  return currentUser ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <Home onLoginSuccess={() => setCurrentUser(true)} />
  );
};

export default App;
