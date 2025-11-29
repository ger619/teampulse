import { useEffect, useState } from "react";
import Home from "./Home";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    console.log("🔍 App mounted - checking authentication...");
    const authToken = localStorage.getItem("authToken");
    console.log("📱 Auth token exists:", !!authToken);
    
    if (authToken) {
      console.log("✅ Setting user to authenticated");
      setCurrentUser(true);
    } else {
      console.log("❌ No auth token found");
      setCurrentUser(false);
    }
  }, []);

  const handleLogout = async () => {
    console.log("🚪 Logout button clicked");
    setIsLoggingOut(true);
    
    try {
      const authToken = localStorage.getItem("authToken");
      console.log("🔑 Token before logout:", authToken);
      
      // Call logout API if token exists
      if (authToken) {
        try {
          console.log("📡 Calling logout API...");
          const response = await fetch('/api/auth/logout/', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          });
          console.log("✅ Logout API response status:", response.status);
        } catch (apiError) {
          console.warn("⚠️ Logout API failed, continuing with client logout:", apiError);
        }
      }
      
      // Always clear localStorage
      console.log("🧹 Removing tokens from localStorage...");
      localStorage.removeItem("authToken");
      localStorage.removeItem("pulse_current_user");
      
      // Verify removal
      const tokenAfterRemoval = localStorage.getItem("authToken");
      console.log("🔍 Token after removal:", tokenAfterRemoval);
      
      // Update state to trigger re-render
      console.log("🔄 Setting currentUser to false");
      setCurrentUser(false);
      
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      setIsLoggingOut(false);
      console.log("🏁 Logout process completed");
    }
  };

  const handleLoginSuccess = () => {
    console.log("🎉 Login successful, updating state...");
    setCurrentUser(true);
  };

  console.log("🔄 Current render - user:", currentUser, "logging out:", isLoggingOut);

  // Show loading during logout
  if (isLoggingOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF1E7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27A5A1] mx-auto mb-4"></div>
          <p className="text-gray-600">Logging out...</p>
        </div>
      </div>
    );
  }

  // Show appropriate component based on auth state
  if (currentUser === null) {
    // Still checking auth
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF1E7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27A5A1] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return currentUser ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <Home onLoginSuccess={handleLoginSuccess} />
  );
};

export default App;