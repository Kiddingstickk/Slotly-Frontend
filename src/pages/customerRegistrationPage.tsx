import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CustomerRegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Customer registration endpoint
      const endpoint = "https://slotly-backend-92ig.onrender.com/api/customers/register";
      const payload = { name: form.name, phone: form.phone };

      const res = await axios.post(endpoint, payload);
      const customer = res.data.customer;

      if (!customer || !customer._id) {
        throw new Error("No customer object returned from backend");
      }

      // Save customerId in localStorage
      localStorage.setItem("customerId", customer._id);

      // Navigate to login or bookings page
      navigate("/customer/login");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">Customer Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/customer/login")}
            className="text-blue-600 underline"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default CustomerRegisterPage;