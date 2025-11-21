import { useState } from "react";

const Signup = ({ onSignupComplete }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    team: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isDisabled =
    !form.name || !form.email || !form.password || !form.team;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isDisabled) {
      setError("Oops! We need all the info to get you started 😊");
      return;
    }

    const users = JSON.parse(localStorage.getItem("pulse_users")) || [];
    const exists = users.find((u) => u.email === form.email);

    if (exists) {
      setError("This email is already registered 😅");
      return;
    }

    users.push(form);
    localStorage.setItem("pulse_users", JSON.stringify(users));

    setSuccess("You're all set! 🎉 Welcome to PulseTeam!");

    setForm({ name: "", email: "", password: "", team: "" });

    // switch to login after 0.8s
    setTimeout(() => {
      onSignupComplete();
    }, 800);
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 mb-2 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
          <span>❗</span>
          <p>{error}</p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-start gap-2 p-3 mb-2 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm">
          <span>🎉</span>
          <p>{success}</p>
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Your awesome name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl bg-gray-100 outline-none"
        />
      </div>

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
          placeholder="Make it secure!"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl bg-gray-100 outline-none"
        />
      </div>

      {/* Team */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Team</label>
        <select
          name="team"
          value={form.team}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl bg-gray-100 outline-none"
        >
          <option value="">Choose your squad</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
          <option value="Support">Support</option>
          <option value="HR">HR</option>
        </select>
      </div>

      <button
        disabled={isDisabled}
        className={`w-full py-3 rounded-xl font-semibold transition ${
          isDisabled
            ? "bg-[#F7A68C] bg-opacity-40 text-gray-400 cursor-not-allowed"
            : "bg-[#F7A68C] text-white hover:bg-[#f79a7b]"
        }`}
      >
        Join PulseTeam
      </button>
    </form>
  );
}

export default Signup;
