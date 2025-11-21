import { useState } from "react";
import Login from "./userAuth/Login";
import Signup from "./userAuth/SignUp";

// Pulse SVG Logo Component
const PulseLogo = () => (
  <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
    {/* Heart shape for pulse */}
    <path
      d="M50 85C50 85 20 65 20 40C20 25 30 15 45 15C55 15 60 20 50 30C40 20 45 15 55 15C70 15 80 25 80 40C80 65 50 85 50 85Z"
      fill="#27A5A1"
    />
    {/* Pulse lines */}
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
);

export default function Home() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-12 px-4 bg-[#FBF1E7]">

      {/* Logo + Branding */}
      <div className="mb-6 text-center">
        <div className="bg-white px-10 py-4 rounded-2xl border border-green-200 shadow-md inline-flex items-center gap-3">
          <PulseLogo />
          <div>
            <h1 className="text-3xl font-semibold text-[#27A5A1]">Team Pulse</h1>
            <p className="text-sm text-[#9EC4C3] -mt-1">wellness dashboard</p>
          </div>
        </div>

        <p className="mt-4 text-gray-600 italic text-lg">
          Welcome to your team's wellness hub 💓
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-[0px_0px_15px_rgba(0,0,0,0.10)] border border-green-200">

        {/* Tab Switch */}
        <div className="flex mb-6 bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition ${
              activeTab === "login"
                ? "bg-white shadow text-gray-800"
                : "text-gray-500"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition ${
              activeTab === "signup"
                ? "bg-white shadow text-gray-800"
                : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Render forms */}
        {activeTab === "login" ? <Login /> : <Signup />}
      </div>
    </div>
  );
}