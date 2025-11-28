import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signUpRequest, signUpSuccess, signUpFailure, setToken } from "../redux/user/signUpSlice";

const Signup = ({ onSignupComplete }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    team: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error: reduxError, success } = useSelector((state) => state.signUp);
  
  const isDisabled = !form.name || !form.email || !form.password || !form.team || loading;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (isDisabled) {
      return;
    }

    dispatch(signUpRequest());

    try {
      const apiData = {
        username: form.email.split('@')[0],
        email: form.email,
        password: form.password,
        first_name: form.name.split(' ')[0],
        last_name: form.name.split(' ').slice(1).join(' ') || form.name,
      };

      const response = await fetch('https://team-pulse-bend.onrender.com/api/v1/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const responseData = await response.json();
      const authToken = responseData.access;

      localStorage.setItem('authToken', authToken);
      dispatch(signUpSuccess());
      dispatch(setToken(authToken));

      setForm({ name: "", email: "", password: "", team: "" });

      setTimeout(() => {
        navigate('/feed');
        if (onSignupComplete) {
          onSignupComplete();
        }
      }, 800);

    } catch (error) {
      dispatch(signUpFailure(error.message));
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      {/* Error */}
      {reduxError && (
        <div className="flex items-start gap-2 p-3 mb-2 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
          <span>❗</span>
          <p>{reduxError}</p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-start gap-2 p-3 mb-2 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm">
          <span>🎉</span>
          <p>You're all set! 🎉 Welcome to PulseTeam!</p>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-start gap-2 p-3 mb-2 bg-blue-50 border border-blue-300 rounded-lg text-blue-700 text-sm">
          <span>⏳</span>
          <p>Creating your account...</p>
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
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
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
        type="submit"
      >
        {loading ? "Creating Account..." : "Join PulseTeam"}
      </button>
    </form>
  );
}

export default Signup;