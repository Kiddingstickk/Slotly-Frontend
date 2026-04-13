import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CustomerLoginPage = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
  });
  const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await axios.post("https://slotly-backend-92ig.onrender.com/api/customers/login", {
        name: form.name,
        phone: form.phone,
        });
        const customer = res.data.customer;

        localStorage.setItem("customerId", customer._id);

        // Check for pending booking
        const pending = localStorage.getItem("pendingBooking");
        if (pending) {
        const bookingPayload = JSON.parse(pending);
        await axios.post("https://slotly-backend-92ig.onrender.com/api/bookings/create", {
            ...bookingPayload,
            customer_id: customer._id,
        });
        localStorage.removeItem("pendingBooking");
        navigate("/bookings"); // go straight to bookings dashboard
        return;
        }

        navigate("/bookings");
    } catch (err) {
        console.error("Login error:", err);
        alert("Login failed. Please check your name and phone.");
    }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">Customer Login</h1>
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
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/customer/register")}
            className="text-blue-600 underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default CustomerLoginPage;