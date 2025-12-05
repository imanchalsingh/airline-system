import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Plane,
  Calendar,
  Briefcase,
  UserCog,
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  Clock,
  CheckCircle,
  Sparkles,
  Home,
  LogOut,
} from "lucide-react";

const RouteCard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.state?.isAdmin || false;
  const [userName, setUserName] = useState<string>("");

  // Fetch user name on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const latestUser = data[data.length - 1];
        setUserName(latestUser.name || "Guest");
      }
    } catch {
      setUserName("Guest");
    }
  };

  const routeCards = [
    {
      id: 1,
      name: "Flight Management",
      icon: Plane,
      description: "Manage flight schedules & routes",
      color: "from-[#F09848] to-[#ffb366]",
      iconColor: "text-[#F09848]",
      bgColor: "bg-[#F09848]/10",
      count: 24,
      stat: "Active Flights",
      path: "/flights",
    },
    {
      id: 2,
      name: "Reservations",
      icon: Calendar,
      description: "Book new reservations",
      color: "from-[#F09848] to-[#ffb366]",
      iconColor: "text-[#F09848]",
      bgColor: "bg-[#F09848]/10",
      count: 156,
      stat: "Today's Bookings",
      path: "/reservation",
    },
    {
      id: 3,
      name: "My Bookings",
      icon: Briefcase,
      description: "View & manage your bookings",
      color: "from-[#F09848] to-[#ffb366]",
      iconColor: "text-[#F09848]",
      bgColor: "bg-[#F09848]/10",
      count: 8,
      stat: "Your Bookings",
      path: "/my-booking",
    },
    ...(isAdmin
      ? [
          {
            id: 4,
            name: "Admin Panel",
            icon: UserCog,
            description: "System administration",
            color: "from-[#F09848] to-[#ffb366]",
            iconColor: "text-[#F09848]",
            bgColor: "bg-[#F09848]/10",
            count: "Pro",
            stat: "Admin Access",
            path: "/admin-panel",
          },
        ]
      : []),
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleHomeClick = () => {
    navigate("/MainPageAsDashboard");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#182850] to-[#0f1c42] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between bg-[#1e3058] rounded-2xl shadow-lg border border-[#2a3a6a] p-4">
            <div className="flex items-center space-x-4">
              <div 
                onClick={handleHomeClick}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-[#F09848] to-[#ffb366] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform border border-[#F09848]/30">
                  <Plane className="text-[#182850]" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#E8F0F0]">SkyLine Airlines</h1>
                  <p className="text-sm text-[#b0c4c4]">Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-[#E8F0F0]">{userName}</p>
                <p className="text-xs text-[#b0c4c4]">{isAdmin ? "Administrator" : "Standard User"}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleHomeClick}
                  className="p-2 text-[#F09848] hover:text-[#ffb366] hover:bg-[#F09848]/10 rounded-lg transition-colors border border-transparent hover:border-[#F09848]/30"
                  title="Dashboard"
                >
                  <Home size={20} />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#ff6b6b] hover:text-[#ff8e8e] hover:bg-[#ff6b6b]/10 rounded-lg transition-colors border border-transparent hover:border-[#ff6b6b]/30"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#E8F0F0]">
                {getGreeting()},{" "}
                <span className="text-[#F09848]">{userName}</span>
                <Sparkles
                  className="inline-block ml-2 text-[#F09848]"
                  size={24}
                />
              </h1>
              <p className="text-[#b0c4c4] mt-2">
                Welcome to your airline management dashboard
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-4 bg-[#1e3058] p-4 rounded-2xl shadow-md border border-[#2a3a6a]">
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#F09848] flex items-center">
                    <Clock size={20} className="mr-2" />
                    {formatTime()}
                  </div>
                  <p className="text-sm text-[#b0c4c4]">{formatDate()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#F09848] to-[#ffb366] rounded-xl flex items-center justify-center border border-[#F09848]/30">
                  <Plane className="text-[#182850]" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1e3058] p-5 rounded-2xl shadow-sm border border-[#2a3a6a]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#b0c4c4]">Active Users</p>
                  <p className="text-2xl font-bold text-[#E8F0F0]">1,842</p>
                </div>
                <div className="w-10 h-10 bg-[#F09848]/20 rounded-lg flex items-center justify-center border border-[#F09848]/30">
                  <Users className="text-[#F09848]" size={20} />
                </div>
              </div>
              <div className="mt-3 text-xs text-green-400 flex items-center">
                <CheckCircle size={12} className="mr-1" />
                <span>+12% from last week</span>
              </div>
            </div>

            <div className="bg-[#1e3058] p-5 rounded-2xl shadow-sm border border-[#2a3a6a]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#b0c4c4]">Today's Revenue</p>
                  <p className="text-2xl font-bold text-[#E8F0F0]">$42.8K</p>
                </div>
                <div className="w-10 h-10 bg-[#F09848]/20 rounded-lg flex items-center justify-center border border-[#F09848]/30">
                  <BarChart3 className="text-[#F09848]" size={20} />
                </div>
              </div>
              <div className="mt-3 text-xs text-green-400 flex items-center">
                <CheckCircle size={12} className="mr-1" />
                <span>+8.2% from yesterday</span>
              </div>
            </div>

            <div className="bg-[#1e3058] p-5 rounded-2xl shadow-sm border border-[#2a3a6a]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#b0c4c4]">Flight On-time</p>
                  <p className="text-2xl font-bold text-[#E8F0F0]">94.7%</p>
                </div>
                <div className="w-10 h-10 bg-[#F09848]/20 rounded-lg flex items-center justify-center border border-[#F09848]/30">
                  <Shield className="text-[#F09848]" size={20} />
                </div>
              </div>
              <div className="mt-3 text-xs text-green-400 flex items-center">
                <CheckCircle size={12} className="mr-1" />
                <span>+2.3% improvement</span>
              </div>
            </div>

            <div className="bg-[#1e3058] p-5 rounded-2xl shadow-sm border border-[#2a3a6a]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#b0c4c4]">Available Seats</p>
                  <p className="text-2xl font-bold text-[#E8F0F0]">3,284</p>
                </div>
                <div className="w-10 h-10 bg-[#F09848]/20 rounded-lg flex items-center justify-center border border-[#F09848]/30">
                  <Plane className="text-[#F09848]" size={20} />
                </div>
              </div>
              <div className="mt-3 text-xs text-[#F09848] flex items-center">
                <span>Across all flights</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Route Cards Section */}
          <div className="lg:col-span-2">
            <div className="bg-[#1e3058] rounded-2xl shadow-lg border border-[#2a3a6a] p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#E8F0F0] mb-2">
                  Quick Actions
                </h2>
                <p className="text-[#b0c4c4]">Select a module to navigate</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {routeCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleNavigation(card.path)}
                    className="group cursor-pointer relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  >
                    {/* Background Gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                    ></div>

                    {/* Card Content */}
                    <div className="relative bg-[#1e3058]/80 backdrop-blur-sm p-6 rounded-2xl border border-[#2a3a6a] group-hover:border-[#F09848]/30 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl ${card.bgColor} border border-[#F09848]/30`}
                        >
                          <card.icon
                            className={`${card.iconColor}`}
                            size={24}
                          />
                        </div>
                        <ArrowRight
                          className="text-[#F09848] group-hover:translate-x-1 transition-transform"
                          size={18}
                        />
                      </div>

                      <h3 className="text-xl font-bold text-[#E8F0F0] mb-2">
                        {card.name}
                      </h3>

                      <p className="text-[#b0c4c4] text-sm mb-4">
                        {card.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-[#2a3a6a]">
                        <div>
                          <p className="text-2xl font-bold text-[#E8F0F0]">
                            {card.count}
                          </p>
                          <p className="text-xs text-[#b0c4c4]">{card.stat}</p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium bg-[#F09848]/20 text-[#F09848] border border-[#F09848]/30`}
                        >
                          Click to open
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-[#1e3058] rounded-2xl shadow-lg border border-[#2a3a6a] p-6">
                <h3 className="text-xl font-bold text-[#E8F0F0] mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      time: "10:30 AM",
                      action: "Flight AA245 updated",
                      user: "You",
                    },
                    {
                      time: "9:15 AM",
                      action: "New booking created",
                      user: "John D.",
                    },
                    {
                      time: "Yesterday",
                      action: "System maintenance",
                      user: "Admin",
                    },
                    {
                      time: "Mar 12",
                      action: "User profile updated",
                      user: "You",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 hover:bg-[#2a3a6a] rounded-xl transition-colors"
                    >
                      <div className="w-2 h-2 bg-[#F09848] rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-[#E8F0F0] font-medium">
                          {activity.action}
                        </p>
                        <p className="text-sm text-[#b0c4c4]">
                          {activity.time} • by {activity.user}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Status */}
              <div className="bg-gradient-to-r from-[#182850] to-[#2a3a6a] rounded-2xl shadow-lg p-6 text-[#E8F0F0] border border-[#F09848]/30">
                <h3 className="text-xl font-bold mb-4">System Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>API Service</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-sm">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Database</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-sm">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Security</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-sm">Active</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E8F0F0]/20">
                  <p className="text-sm opacity-90">
                    All systems running smoothly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-[#b0c4c4] text-sm">
          <p>
            SkyLine Airlines Management System v2.0 • {new Date().getFullYear()}
          </p>
          <p className="mt-1">
            Secure and reliable airline operations platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;