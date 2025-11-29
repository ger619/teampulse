import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUpRequest, signUpSuccess, signUpFailure, setToken } from "../redux/user/signUpSlice";

const Signup = ({ onSignupComplete }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    team: "",
  });

  const dispatch = useDispatch();
  
  const { loading, error: reduxError, success } = useSelector((state) => state.signUp);
  
  const isDisabled = !form.name || !form.email || !form.password || !form.team || loading;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear errors when user starts typing
    if (reduxError) {
      dispatch(signUpFailure(null));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (isDisabled && !loading) {
      return;
    }

    dispatch(signUpRequest());

    try {
      // Split the full name into first and last name
      const nameParts = form.name.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Prepare data for API
      const apiData = {
        username: form.email.split('@')[0], // Generate username from email
        email: form.email,
        password: form.password,
        first_name: firstName,
        last_name: lastName,
      };

      const response = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `Registration failed: ${response.status}`);
      }

      const authToken = responseData.access;

      // Store token in localStorage
      localStorage.setItem('authToken', authToken);
      
      // Dispatch success actions
      dispatch(signUpSuccess());
      dispatch(setToken(authToken));

      // Clear form
      setForm({ name: "", email: "", password: "", team: "" });

      // Show success message for 2 seconds before switching to login
      setTimeout(() => {
        if (onSignupComplete) {
          onSignupComplete();
        }
      }, 2000);

    } catch (error) {
      dispatch(signUpFailure(error.message));
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      {/* Error */}
      {reduxError && (
        <div className="flex items-start gap-2 p-3 mb-2 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm animate-fadeIn">
          <span>❗</span>
          <p>{reduxError}</p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-start gap-2 p-3 mb-2 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm animate-fadeIn">
          <span>✅</span>
          <div>
            <p className="font-semibold">Account created successfully! 🎉</p>
            <p className="text-xs mt-1">Redirecting to login...</p>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-start gap-2 p-3 mb-2 bg-blue-50 border border-blue-300 rounded-lg text-blue-700 text-sm animate-fadeIn">
          <span>⏳</span>
          <div>
            <p className="font-semibold">Creating your account...</p>
            <p className="text-xs mt-1">Please wait while we set up your PulseTeam account</p>
          </div>
        </div>
      )}

      {/* Form Fields - Disabled during loading/success */}
      <div className={loading || success ? "opacity-60 pointer-events-none" : ""}>
        {/* Name */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl bg-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#F7A68C] transition-all"
            disabled={loading || success}
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
            className="w-full px-4 py-2 rounded-xl bg-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#F7A68C] transition-all"
            disabled={loading || success}
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
            className="w-full px-4 py-2 rounded-xl bg-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#F7A68C] transition-all"
            disabled={loading || success}
          />
        </div>

        {/* Team */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Team</label>
          <select
            name="team"
            value={form.team}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl bg-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#F7A68C] transition-all"
            disabled={loading || success}
          >
            <option value="">Choose your squad</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Support">Support</option>
            <option value="HR">HR</option>
          </select>
        </div>
      </div>

      <button
        disabled={isDisabled}
        className={`w-full py-3 rounded-xl font-semibold transition-all ${
          isDisabled
            ? "bg-[#F7A68C] bg-opacity-40 text-gray-400 cursor-not-allowed"
            : success
            ? "bg-green-500 text-white cursor-default"
            : loading
            ? "bg-[#F7A68C] text-white cursor-wait"
            : "bg-[#F7A68C] text-white hover:bg-[#f79a7b] hover:scale-[1.02]"
        }`}
        type="submit"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Account...
          </span>
        ) : success ? (
          "✅ Account Created!"
        ) : (
          "Join PulseTeam"
        )}
      </button>
    </form>
  );
}

export default Signup;