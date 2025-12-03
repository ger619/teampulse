import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/user/logInSlice";

const Login = ({ onLoginSuccess }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error: reduxError, success } = useSelector((state) => state.logIn);
  
  const isDisabled = !form.email || !form.password || loading;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isDisabled) {
      return;
    }

    try {
      const result = await dispatch(login({
        email: form.email,
        password: form.password
      })).unwrap();
      
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      
      navigate('/feed');
    } catch (error) {
      // Error is already handled by Redux
      console.error('Login failed:', error);
    }
  };

  const errorMessage = reduxError || (isDisabled && !form.email && !form.password ? "Oops! We need all the info to get you started 😊" : "");

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {/* Error */}
      {(reduxError || errorMessage) && (
        <div className="flex items-start gap-2 p-3 mb-2 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
          <span>❗</span>
          <p>{reduxError || errorMessage}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-start gap-2 p-3 mb-2 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm">
          <span>✅</span>
          <p>Login successful!</p>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-start gap-2 p-3 mb-2 bg-blue-50 border border-blue-300 rounded-lg text-blue-700 text-sm">
          <span>⏳</span>
          <p>Logging in...</p>
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
          disabled={loading}
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
          disabled={loading}
        />
      </div>

      <button
        disabled={isDisabled}
        className={`w-full py-3 rounded-xl font-semibold transition ${
          isDisabled
            ? "bg-[#A0D6C2] bg-opacity-40 text-gray-400 cursor-not-allowed"
            : "bg-[#A0D6C2] text-white hover:bg-[#8acdb5]"
        }`}
        type="submit"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

export default Login;