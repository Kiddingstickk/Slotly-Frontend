import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Login endpoint
      const endpoint = "https://slotly-backend-92ig.onrender.com/api/users/login";
      const payload = { email: form.email, password: form.password };

      const res = await axios.post(endpoint, payload);
      const user = res.data;

      if (!user || !user._id) {
        throw new Error("No user object returned from backend");
      }

      // Save token + userId
      localStorage.setItem("userId", user._id);
      localStorage.setItem("token", user.token);

      // Check if business exists
      const businessRes = await axios.get(
        `https://slotly-backend-92ig.onrender.com/api/businesses/user/${user._id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (businessRes.data.businesses?.length > 0) {
        navigate("/dashboard");
      } else {
        navigate("/business/register");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">Business Owner Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;