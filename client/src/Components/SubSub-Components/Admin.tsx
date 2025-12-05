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
    <div className="min-h-screen bg-gradient-to-br from-[#182850] to-[#0f1c42] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#E8F0F0] flex items-center">
                <Shield className="mr-3 text-[#F09848]" size={32} />
                Admin Control Panel
              </h1>
              <p className="text-[#b0c4c4] mt-2">Manage flights, users, and system operations</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="px-4 py-2 bg-[#1e3058] rounded-xl shadow-sm border border-[#2a3a6a]">
                <p className="text-sm text-[#b0c4c4]">Last Updated</p>
                <p className="font-semibold text-[#E8F0F0]">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-[#182850] to-[#2a3a6a] rounded-2xl p-6 text-[#E8F0F0] shadow-lg border border-[#F09848]/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Users</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                </div>
                <Users size={32} className="opacity-80" />
              </div>
              <div className="mt-4 pt-4 border-t border-[#E8F0F0]/20">
                <p className="text-xs flex items-center">
                  <CheckCircle size={12} className="mr-1" />
                  <span>{filteredUsers.filter(u => u.status === "active").length} active</span>
                </p>
              </div>
            </div>

            <div className="bg-[#1e3058] rounded-2xl p-6 shadow-lg border border-[#2a3a6a]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#b0c4c4]">Active Flights</p>
                  <p className="text-3xl font-bold text-[#E8F0F0] mt-2">{stats.activeFlights}</p>
                </div>
                <div className="w-12 h-12 bg-[#F09848]/20 rounded-xl flex items-center justify-center border border-[#F09848]/30">
                  <Plane className="text-[#F09848]" size={24} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#2a3a6a]">
                <p className="text-xs text-[#b0c4c4] flex items-center">
                  <Clock size={12} className="mr-1" />
                  <span>Real-time tracking</span>
                </p>
              </div>
            </div>

            <div className="bg-[#1e3058] rounded-2xl p-6 shadow-lg border border-[#2a3a6a]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#b0c4c4]">Total Bookings</p>
                  <p className="text-3xl font-bold text-[#E8F0F0] mt-2">{stats.totalBookings.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-[#F09848]/20 rounded-xl flex items-center justify-center border border-[#F09848]/30">
                  <BarChart3 className="text-[#F09848]" size={24} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#2a3a6a]">
                <p className="text-xs text-green-400 flex items-center">
                  <CheckCircle size={12} className="mr-1" />
                  <span>+12% this month</span>
                </p>
              </div>
            </div>

            <div className="bg-[#1e3058] rounded-2xl p-6 shadow-lg border border-[#2a3a6a]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#b0c4c4]">Revenue</p>
                  <p className="text-3xl font-bold text-[#E8F0F0] mt-2">${stats.revenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-[#F09848]/20 rounded-xl flex items-center justify-center border border-[#F09848]/30">
                  <span className="text-[#F09848] font-bold text-xl">$</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#2a3a6a]">
                <p className="text-xs text-green-400 flex items-center">
                  <CheckCircle size={12} className="mr-1" />
                  <span>+8.5% growth</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-[#1e3058] rounded-xl p-1 shadow-sm border border-[#2a3a6a] w-fit">
            <button
              onClick={() => setActiveTab("flights")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === "flights" ? 'bg-[#F09848] text-[#182850]' : 'text-[#b0c4c4] hover:bg-[#2a3a6a]'}`}
            >
              <div className="flex items-center">
                <Plane size={18} className="mr-2" />
                Flight Management
              </div>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === "users" ? 'bg-[#F09848] text-[#182850]' : 'text-[#b0c4c4] hover:bg-[#2a3a6a]'}`}
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
              <div className="bg-[#1e3058] rounded-2xl shadow-lg border border-[#2a3a6a] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#E8F0F0]">Add New Flight</h3>
                    <p className="text-[#b0c4c4]">Create a new flight schedule</p>
                  </div>
                  <PlusCircle className="text-[#F09848]" size={24} />
                </div>

                <form onSubmit={handleAddFlight} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#E8F0F0]">Flight Number *</label>
                      <input
                        type="text"
                        name="flightNumber"
                        placeholder="e.g., AA245"
                        value={flight.flightNumber}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-[#2a3a6a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F09848] focus:border-[#F09848] transition-all bg-[#1e3058] text-[#E8F0F0] placeholder-[#7a8ab8]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#E8F0F0]">Departure *</label>
                      <input
                        type="text"
                        name="departure"
                        placeholder="From city"
                        value={flight.departure}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-[#2a3a6a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F09848] focus:border-[#F09848] transition-all bg-[#1e3058] text-[#E8F0F0] placeholder-[#7a8ab8]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#E8F0F0]">Arrival *</label>
                      <input
                        type="text"
                        name="arrival"
                        placeholder="To city"
                        value={flight.arrival}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-[#2a3a6a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F09848] focus:border-[#F09848] transition-all bg-[#1e3058] text-[#E8F0F0] placeholder-[#7a8ab8]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#E8F0F0]">Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={flight.date}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-[#2a3a6a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F09848] focus:border-[#F09848] transition-all bg-[#1e3058] text-[#E8F0F0] placeholder-[#7a8ab8]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#E8F0F0]">Time *</label>
                      <input
                        type="time"
                        name="time"
                        value={flight.time}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-[#2a3a6a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F09848] focus:border-[#F09848] transition-all bg-[#1e3058] text-[#E8F0F0] placeholder-[#7a8ab8]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#E8F0F0]">Airline *</label>
                      <input
                        type="text"
                        name="airline"
                        placeholder="Airline name"
                        value={flight.airline}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-[#2a3a6a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F09848] focus:border-[#F09848] transition-all bg-[#1e3058] text-[#E8F0F0] placeholder-[#7a8ab8]"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-[#F09848] to-[#ffb366] hover:from-[#e8893a] hover:to-[#ffa754] text-[#182850] font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                    >
                      <PlusCircle className="mr-2" size={20} />
                      Add Flight to Schedule
                    </button>
                  </div>
                </form>

                {message && (
                  <div className={`mt-4 p-4 rounded-xl ${message.includes("success") ? 'bg-green-400/10 border border-green-400/30' : 'bg-red-400/10 border border-red-400/30'}`}>
                    <div className="flex items-center">
                      {message.includes("success") ? (
                        <CheckCircle className="text-green-400 mr-3" size={20} />
                      ) : (
                        <AlertCircle className="text-red-400 mr-3" size={20} />
                      )}
                      <p className={message.includes("success") ? "text-green-400 font-medium" : "text-red-400 font-medium"}>
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
              <div className="bg-[#1e3058] rounded-2xl shadow-lg border border-[#2a3a6a] overflow-hidden">
                {/* User Management Header */}
                <div className="p-6 border-b border-[#2a3a6a]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[#E8F0F0]">User Management</h3>
                      <p className="text-[#b0c4c4]">Manage all registered users</p>
                    </div>
                    <div className="flex items-center space-x-3 mt-4 md:mt-0">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a8ab8]" size={18} />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2.5 border border-[#2a3a6a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F09848] focus:border-[#F09848] w-full md:w-64 bg-[#1e3058] text-[#E8F0F0] placeholder-[#7a8ab8]"
                        />
                      </div>
                      <button className="p-2.5 border border-[#2a3a6a] rounded-xl hover:bg-[#2a3a6a] transition-colors">
                        <Filter size={18} className="text-[#b0c4c4]" />
                      </button>
                      <button className="p-2.5 border border-[#2a3a6a] rounded-xl hover:bg-[#2a3a6a] transition-colors">
                        <Download size={18} className="text-[#b0c4c4]" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#2a3a6a]">
                      <tr>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-[#E8F0F0]">User</th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-[#E8F0F0]">Contact</th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-[#E8F0F0]">Location</th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-[#E8F0F0]">Status</th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-[#E8F0F0]">Join Date</th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-[#E8F0F0]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a3a6a]">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center">
                            <div className="flex flex-col items-center">
                              <Users className="text-[#4a5a8a] mb-3" size={48} />
                              <p className="text-[#b0c4c4]">No users found</p>
                              {searchTerm && (
                                <p className="text-[#7a8ab8] text-sm mt-1">Try a different search term</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.email} className="hover:bg-[#2a3a6a] transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-[#F09848] to-[#ffb366] rounded-xl flex items-center justify-center mr-3">
                                  <span className="text-[#182850] font-bold text-sm">
                                    {getInitials(user.name)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-[#E8F0F0]">{user.name}</p>
                                  <p className="text-sm text-[#b0c4c4]">{user.districtCode}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <p className="text-[#E8F0F0]">{user.email}</p>
                              <p className="text-sm text-[#b0c4c4]">No phone</p>
                            </td>
                            <td className="py-4 px-6">
                              <div>
                                <p className="text-[#E8F0F0]">{user.city}, {user.state}</p>
                                <p className="text-sm text-[#b0c4c4]">{user.country}</p>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.status === "active" ? 'bg-green-400/20 text-green-400 border border-green-400/30' : 'bg-[#4a5a8a] text-[#b0c4c4] border border-[#2a3a6a]'}`}>
                                <span className={`w-2 h-2 rounded-full mr-2 ${user.status === "active" ? 'bg-green-400' : 'bg-[#b0c4c4]'}`}></span>
                                {user.status === "active" ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-[#b0c4c4]">
                              {user.joinDate}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleRemoveUser(user.email)}
                                  className="p-2 text-[#ff6b6b] hover:text-[#ff8e8e] hover:bg-[#ff6b6b]/10 rounded-lg transition-colors border border-transparent hover:border-[#ff6b6b]/30"
                                  title="Remove User"
                                >
                                  <Trash2 size={18} />
                                </button>
                                <button className="p-2 text-[#F09848] hover:text-[#ffb366] hover:bg-[#F09848]/10 rounded-lg transition-colors border border-transparent hover:border-[#F09848]/30" title="View Details">
                                  <Eye size={18} />
                                </button>
                                <button className="p-2 text-[#b0c4c4] hover:text-[#E8F0F0] hover:bg-[#2a3a6a] rounded-lg transition-colors" title="More Options">
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
                <div className="p-4 border-t border-[#2a3a6a] bg-[#2a3a6a]">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#b0c4c4]">
                      Showing <span className="font-semibold text-[#E8F0F0]">{filteredUsers.length}</span> of <span className="font-semibold text-[#E8F0F0]">{users.length}</span> users
                    </p>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1.5 border border-[#2a3a6a] rounded-lg text-sm hover:bg-[#1e3058] transition-colors text-[#b0c4c4]">
                        Previous
                      </button>
                      <button className="px-3 py-1.5 bg-[#F09848] text-[#182850] rounded-lg text-sm hover:bg-[#ffb366] transition-colors font-semibold">
                        1
                      </button>
                      <button className="px-3 py-1.5 border border-[#2a3a6a] rounded-lg text-sm hover:bg-[#1e3058] transition-colors text-[#b0c4c4]">
                        Next
                      </button>
                    </div>
                  </div>
                </div>

                {userMsg && (
                  <div className="mx-6 mb-6 p-4 bg-[#F09848]/10 border border-[#F09848]/30 rounded-xl">
                    <div className="flex items-center">
                      <CheckCircle className="text-[#F09848] mr-3" size={20} />
                      <p className="text-[#F09848] font-medium">{userMsg}</p>
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
                <div className="bg-gradient-to-r from-[#182850] to-[#2a3a6a] rounded-2xl p-6 text-[#E8F0F0] shadow-lg border border-[#F09848]/30">
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
                <div className="bg-[#1e3058] rounded-2xl shadow-lg border border-[#2a3a6a] p-6">
                  <h4 className="text-lg font-bold text-[#E8F0F0] mb-4">Recent Actions</h4>
                  <div className="space-y-3">
                    {[
                      { time: "10:30 AM", action: "Flight AA245 added" },
                      { time: "9:15 AM", action: "User John removed" },
                      { time: "Yesterday", action: "System maintenance" },
                      { time: "Mar 12", action: "Flight schedule updated" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 hover:bg-[#2a3a6a] rounded-xl transition-colors">
                        <div className="w-2 h-2 bg-[#F09848] rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-[#E8F0F0]">{activity.action}</p>
                          <p className="text-xs text-[#b0c4c4]">{activity.time}</p>
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
        <div className="mt-8 p-4 bg-[#1e3058] rounded-xl shadow-sm border border-[#2a3a6a]">
          <div className="flex items-center">
            <Shield className="text-[#F09848] mr-3" size={20} />
            <div>
              <p className="text-sm text-[#E8F0F0]">
                <span className="font-semibold">Security Note:</span> Admin actions are logged and monitored.
              </p>
              <p className="text-xs text-[#b0c4c4] mt-1">
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