import { useEffect, useState } from "react";
import axios from "axios";

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const customerId = localStorage.getItem("customerId");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `https://slotly-backend-92ig.onrender.com/api/bookings/customer/${customerId}`
        );
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [customerId]);

  if (loading) {
    return <div className="p-6">Loading your bookings...</div>;
  }

  if (!customerId) {
    return <div className="p-6">Please log in to view your bookings.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-600">You have no bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking._id}
              className="bg-white shadow rounded p-4 border"
            >
              <p className="font-semibold">
                Service: {booking.service_id}
              </p>
              <p>
                Date: {new Date(booking.booking_date).toLocaleDateString()}
              </p>
              <p>Time: {booking.booking_time}</p>
              <p>Status: {booking.status}</p>
              {booking.business_id?.name && (
                <p>Business: {booking.business_id.name}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerDashboard;