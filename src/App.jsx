import { useEffect, useState } from "react";
import Home from "./Home";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  // load user on app start
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("pulse_current_user"));
    setCurrentUser(user);
  }, []);

  return currentUser ? (
    <Dashboard />
  ) : (
    <Home onLoginSuccess={() => setCurrentUser(true)} />
  );
}

export default App;
