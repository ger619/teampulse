import { useState } from "react";

const Login = ({ onLoginSuccess }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const isDisabled = !form.email || !form.password;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (isDisabled) {
      setError("Oops! We need all the info to get you started 😊");
      return;
    }

    const users = JSON.parse(localStorage.getItem("pulse_users")) || [];
    const user = users.find(
      (u) => u.email === form.email && u.password === form.password
    );

    if (!user) {
      setError("No matching account found 😕");
      return;
    }

    localStorage.setItem("pulse_current_user", JSON.stringify(user));

    // notify parent (App.jsx)
    onLoginSuccess();
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 mb-2 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
          <span>❗</span>
          <p>{error}</p>
        </div>
      )}

      {/* Email */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl bg-gray-100 outline-none"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          placeholder="•••••••"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl bg-gray-100 outline-none"
        />
      </div>

      <button
        disabled={isDisabled}
        className={`w-full py-3 rounded-xl font-semibold transition ${
          isDisabled
            ? "bg-[#A0D6C2] bg-opacity-40 text-gray-400 cursor-not-allowed"
            : "bg-[#A0D6C2] text-white hover:bg-[#8acdb5]"
        }`}
      >
        Login
      </button>
    </form>
  );
}

export default Login;
