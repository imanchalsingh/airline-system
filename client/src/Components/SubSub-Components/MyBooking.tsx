import React, { useEffect, useState } from "react";

interface Booking {
  id: number;
  flightNumber: string;
  departure: string;
  arrival: string;
  date: string;
  time: string;
  airline: string;
  bookedAt: string;
}

const MyBooking: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("myBookings") || "[]");
    setBookings(stored);
  }, []);

  const handleRemove = (idx: number) => {
    const updated = bookings.filter((_, i) => i !== idx);
    setBookings(updated);
    localStorage.setItem("myBookings", JSON.stringify(updated));
  };

  return (
    <div className="overflow-y-auto p-8">
      <h1 className="text-3xl font-bold text-center text-[#4d92fa] mb-8">
        🧾 My Bookings
      </h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">No bookings yet.</p>
      ) : (
        <div className="grid gap-6 max-w-3xl mx-auto">
          {bookings.map((booking, index) => (
            <div
              key={index}
              className="relative bg-white p-5 rounded-lg shadow-md border-l-4 border-[#2c7df8]"
            >
              {/* 🗑 remove button */}
              <button
                onClick={() => handleRemove(index)}
                title="Remove booking"
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 cursor-pointer"
              >
                🗑
              </button>

              <h2 className="text-lg font-bold text-gray-800 mb-1">
                Flight: {booking.flightNumber}
              </h2>
              <p className="text-sm text-gray-700 mb-1">
                {booking.departure} ➡️ {booking.arrival}
              </p>
              <p className="text-sm text-gray-700">
                🕒 {booking.date} at {booking.time}
              </p>
              <p className="text-sm text-gray-700">
                ✈️ Airline: {booking.airline}
              </p>
              <p className="text-sm text-green-600 mt-2">
                📆 Booked on: {booking.bookedAt}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooking;
