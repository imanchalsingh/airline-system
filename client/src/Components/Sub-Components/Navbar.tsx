import React, { useEffect, useState } from "react";
import { Plane, Settings, Bell, HelpCircle, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserData {
  name: string;
  role?: string;
}

const Navbar: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({ name: "User" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount] = useState(3);
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const latestUser = data[data.length - 1];
        setUserData({
          name: latestUser.name || "User",
          role: latestUser.role || "User",
        });
      }
    } catch {
      setUserData({ name: "User", role: "User" });
    }
  };

  const handleProfileClick = () => {
    navigate("/create-profile");
  };

  const handleLogoClick = () => {
    navigate("/MainPageAsDashboard");
  };

  const getInitials = (name: string) => {
    if (name) return "AS";
  };

  const getUserRoleColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "from-cyan-600 to-blue-600";
      case "user":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-gray-600 to-gray-700";
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 to-cyan-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo and Brand */}
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden mr-3 text-white hover:text-blue-100 transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Logo */}
              <div
                onClick={handleLogoClick}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                  <Plane className="text-white h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    SkyLine Airlines
                  </h1>
                  <p className="text-xs text-blue-100 opacity-90">
                    Profile Management
                  </p>
                </div>
              </div>
            </div>

            {/* Right: User Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-white hover:text-blue-100 hover:bg-white/10 rounded-full transition-colors relative">
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Help */}
              <button className="hidden md:flex p-2 text-white hover:text-blue-100 hover:bg-white/10 rounded-full transition-colors">
                <HelpCircle size={20} />
              </button>

              {/* Settings */}
              <button className="hidden md:flex p-2 text-white hover:text-blue-100 hover:bg-white/10 rounded-full transition-colors">
                <Settings size={20} />
              </button>

              {/* User Profile */}
              <div className="relative">
                <div
                  onClick={handleProfileClick}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  {/* Profile Avatar */}
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getUserRoleColor(
                        userData.role
                      )} flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                    >
                      <span className="text-white font-bold text-lg">
                        {getInitials(userData.name)}
                      </span>
                    </div>
                    {/* Online Status Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-blue-700 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Status Bar */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs text-gray-600">
                  System Status: Operational
                </span>
              </div>
              <div className="hidden md:block">
                <span className="text-xs text-gray-600">
                  Last sync: Just now
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              <span className="hidden md:inline">
                Welcome to SkyLine Airlines Management System
              </span>
              <span className="md:hidden">SkyLine Airlines</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
