import React, { useState, useEffect } from "react";
import { 
  PlusCircle, 
  Trash2, 
  Users, 
  Plane, 
  Shield, 
  BarChart3,
  Search,
  Filter,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  MoreVertical
} from "lucide-react";

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
  joinDate?: string;
  status?: "active" | "inactive";
}

const Admin: React.FC = () => {
  const [flight, setFlight] = useState(initialFlight);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [userMsg, setUserMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("flights");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeFlights: 0,
    totalBookings: 0,
    revenue: 0
  });

  // Fetch users and stats
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/profile");
      const data = await res.json();
      const usersWithDates = data.map((user: User) => ({
        ...user,
        joinDate: new Date().toISOString().split('T')[0],
        status: Math.random() > 0.2 ? "active" : "inactive"
      }));
      setUsers(usersWithDates);
      setStats(prev => ({ ...prev, totalUsers: usersWithDates.length }));
    } catch {
      setUserMsg("Failed to load users");
    }
  };

  const fetchStats = async () => {
    // Mock stats - replace with actual API calls
    setStats({
      totalUsers: users.length,
      activeFlights: 42,
      totalBookings: 1287,
      revenue: 125430
    });
  };

  const handleRemoveUser = async (email: string) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    try {
      await fetch(`http://localhost:5000/api/profile/${email}`, { method: "DELETE" });
      setUsers(users.filter((u) => u.email !== email));
      setUserMsg("User removed successfully!");
      setTimeout(() => setUserMsg(""), 3000);
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
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Error adding flight");
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center">
                <Shield className="mr-3 text-blue-600" size={32} />
                Admin Control Panel
              </h1>
              <p className="text-gray-600 mt-2">Manage flights, users, and system operations</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-blue-100">
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-semibold text-gray-800">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Users</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                </div>
                <Users size={32} className="opacity-80" />
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-xs flex items-center">
                  <CheckCircle size={12} className="mr-1" />
                  <span>{filteredUsers.filter(u => u.status === "active").length} active</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Flights</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.activeFlights}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Plane className="text-blue-600" size={24} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 flex items-center">
                  <Clock size={12} className="mr-1" />
                  <span>Real-time tracking</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalBookings.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="text-emerald-600" size={24} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-green-600 flex items-center">
                  <CheckCircle size={12} className="mr-1" />
                  <span>+12% this month</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">${stats.revenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <span className="text-amber-600 font-bold text-xl">$</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-green-600 flex items-center">
                  <CheckCircle size={12} className="mr-1" />
                  <span>+8.5% growth</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-sm border border-blue-100 w-fit">
            <button
              onClick={() => setActiveTab("flights")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === "flights" ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-blue-50'}`}
            >
              <div className="flex items-center">
                <Plane size={18} className="mr-2" />
                Flight Management
              </div>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === "users" ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-blue-50'}`}
            >
              <div className="flex items-center">
                <Users size={18} className="mr-2" />
                User Management
              </div>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Flight Management */}
          {activeTab === "flights" && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Add New Flight</h3>
                    <p className="text-gray-600">Create a new flight schedule</p>
                  </div>
                  <PlusCircle className="text-blue-600" size={24} />
                </div>

                <form onSubmit={handleAddFlight} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Flight Number *</label>
                      <input
                        type="text"
                        name="flightNumber"
                        placeholder="e.g., AA245"
                        value={flight.flightNumber}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Departure *</label>
                      <input
                        type="text"
                        name="departure"
                        placeholder="From city"
                        value={flight.departure}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Arrival *</label>
                      <input
                        type="text"
                        name="arrival"
                        placeholder="To city"
                        value={flight.arrival}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={flight.date}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Time *</label>
                      <input
                        type="time"
                        name="time"
                        value={flight.time}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Airline *</label>
                      <input
                        type="text"
                        name="airline"
                        placeholder="Airline name"
                        value={flight.airline}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                    >
                      <PlusCircle className="mr-2" size={20} />
                      Add Flight to Schedule
                    </button>
                  </div>
                </form>

                {message && (
                  <div className={`mt-4 p-4 rounded-xl ${message.includes("success") ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center">
                      {message.includes("success") ? (
                        <CheckCircle className="text-green-600 mr-3" size={20} />
                      ) : (
                        <AlertCircle className="text-red-600 mr-3" size={20} />
                      )}
                      <p className={message.includes("success") ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                        {message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Column - User Management */}
          {activeTab === "users" && (
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                {/* User Management Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">User Management</h3>
                      <p className="text-gray-600">Manage all registered users</p>
                    </div>
                    <div className="flex items-center space-x-3 mt-4 md:mt-0">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                        />
                      </div>
                      <button className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                        <Filter size={18} />
                      </button>
                      <button className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">User</th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Contact</th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Location</th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Join Date</th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center">
                            <div className="flex flex-col items-center">
                              <Users className="text-gray-300 mb-3" size={48} />
                              <p className="text-gray-500">No users found</p>
                              {searchTerm && (
                                <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.email} className="hover:bg-blue-50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
                                  <span className="text-white font-bold text-sm">
                                    {getInitials(user.name)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">{user.name}</p>
                                  <p className="text-sm text-gray-500">{user.districtCode}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <p className="text-gray-800">{user.email}</p>
                              <p className="text-sm text-gray-500">No phone</p>
                            </td>
                            <td className="py-4 px-6">
                              <div>
                                <p className="text-gray-800">{user.city}, {user.state}</p>
                                <p className="text-sm text-gray-500">{user.country}</p>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.status === "active" ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                <span className={`w-2 h-2 rounded-full mr-2 ${user.status === "active" ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                {user.status === "active" ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-gray-600">
                              {user.joinDate}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleRemoveUser(user.email)}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Remove User"
                                >
                                  <Trash2 size={18} />
                                </button>
                                <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                  <Eye size={18} />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors" title="More Options">
                                  <MoreVertical size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing <span className="font-semibold">{filteredUsers.length}</span> of <span className="font-semibold">{users.length}</span> users
                    </p>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-white transition-colors">
                        Previous
                      </button>
                      <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                        1
                      </button>
                      <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-white transition-colors">
                        Next
                      </button>
                    </div>
                  </div>
                </div>

                {userMsg && (
                  <div className="mx-6 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center">
                      <CheckCircle className="text-blue-600 mr-3" size={20} />
                      <p className="text-blue-700 font-medium">{userMsg}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Side Panel (for flights tab) */}
          {activeTab === "flights" && (
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
                  <h4 className="text-lg font-bold mb-4">Flight Operations</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Scheduled Today</span>
                      <span className="font-bold">24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>In Air</span>
                      <span className="font-bold">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Delayed</span>
                      <span className="font-bold">2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>On Time</span>
                      <span className="font-bold">92%</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Recent Actions</h4>
                  <div className="space-y-3">
                    {[
                      { time: "10:30 AM", action: "Flight AA245 added" },
                      { time: "9:15 AM", action: "User John removed" },
                      { time: "Yesterday", action: "System maintenance" },
                      { time: "Mar 12", action: "Flight schedule updated" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 hover:bg-blue-50 rounded-xl transition-colors">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-gray-800">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-white rounded-xl shadow-sm border border-blue-100">
          <div className="flex items-center">
            <Shield className="text-blue-600 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Security Note:</span> Admin actions are logged and monitored.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                All changes are irreversible and require confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;