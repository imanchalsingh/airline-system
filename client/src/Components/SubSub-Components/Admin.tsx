import React, { useState, useEffect } from "react";

const initialFlight = {
  flightNumber: "",
  departure: "",
  arrival: "",
  date: "",
  time: "",
  airline: "",
};

interface User {
  name: string;
  email: string;
  country: string;
  state: string;
  district: string;
  city: string;
  districtCode: string;
}

const Admin: React.FC = () => {
  const [flight, setFlight] = useState(initialFlight);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [userMsg, setUserMsg] = useState("");

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch {
      setUserMsg("Failed to load users");
    }
  };

  const handleRemoveUser = async (email: string) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    try {
      await fetch(`http://localhost:5000/api/users/${email}`, { method: "DELETE" });
      setUsers(users.filter((u) => u.email !== email));
      setUserMsg("User removed successfully!");
    } catch {
      setUserMsg("Failed to remove user");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlight({ ...flight, [e.target.name]: e.target.value });
  };

  const handleAddFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flight),
      });
      if (!res.ok) throw new Error("Failed to add flight");
      setMessage("Flight added successfully!");
      setFlight(initialFlight);
    } catch {
      setMessage("Error adding flight");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl shadow-2xl max-w-6xl mx-auto mt-4 sm:mt-8">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-green-800 text-center tracking-wide">
        Admin Panel
      </h2>
      {/* Flight Management */}
      <div className="mb-10">
        <h3 className="text-lg sm:text-xl font-bold mb-4 text-green-700">Add New Flight</h3>
        <form
          onSubmit={handleAddFlight}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          <input
            type="text"
            name="flightNumber"
            placeholder="Flight Number"
            value={flight.flightNumber}
            onChange={handleChange}
            required
            className="p-2 border rounded shadow w-full"
          />
          <input
            type="text"
            name="departure"
            placeholder="Departure"
            value={flight.departure}
            onChange={handleChange}
            required
            className="p-2 border rounded shadow w-full"
          />
          <input
            type="text"
            name="arrival"
            placeholder="Arrival"
            value={flight.arrival}
            onChange={handleChange}
            required
            className="p-2 border rounded shadow w-full"
          />
          <input
            type="date"
            name="date"
            placeholder="Date"
            value={flight.date}
            onChange={handleChange}
            required
            className="p-2 border rounded shadow w-full"
          />
          <input
            type="time"
            name="time"
            placeholder="Time"
            value={flight.time}
            onChange={handleChange}
            required
            className="p-2 border rounded shadow w-full"
          />
          <input
            type="text"
            name="airline"
            placeholder="Airline"
            value={flight.airline}
            onChange={handleChange}
            required
            className="p-2 border rounded shadow w-full"
          />
          <button
            type="submit"
            className="sm:col-span-2 md:col-span-3 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 font-semibold shadow transition w-full"
          >
            Add Flight
          </button>
        </form>
        {message && <p className="mt-2 text-center text-green-700">{message}</p>}
      </div>
      {/* User Management */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold mb-4 text-blue-700">User Management</h3>
        {userMsg && <p className="mb-2 text-center text-blue-700">{userMsg}</p>}
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white rounded-lg text-sm sm:text-base">
            <thead>
              <tr className="bg-green-200 text-green-900">
                <th className="py-2 px-2 sm:px-4">Name</th>
                <th className="py-2 px-2 sm:px-4">Email</th>
                <th className="py-2 px-2 sm:px-4">Country</th>
                <th className="py-2 px-2 sm:px-4">State</th>
                <th className="py-2 px-2 sm:px-4">City</th>
                <th className="py-2 px-2 sm:px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.email} className="hover:bg-green-50">
                    <td className="py-2 px-2 sm:px-4">{user.name}</td>
                    <td className="py-2 px-2 sm:px-4">{user.email}</td>
                    <td className="py-2 px-2 sm:px-4">{user.country}</td>
                    <td className="py-2 px-2 sm:px-4">{user.state}</td>
                    <td className="py-2 px-2 sm:px-4">{user.city}</td>
                    <td className="py-2 px-2 sm:px-4">
                      <button
                        onClick={() => handleRemoveUser(user.email)}
                        className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded shadow transition text-xs sm:text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
