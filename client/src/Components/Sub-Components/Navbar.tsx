import React, { useEffect } from "react";
import { Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserName {
  name: string;
}

const Navbar: React.FC = () => {
  const [userName, setUserName] = React.useState<UserName>({ name: "U" });

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setUserName({ name: data[data.length - 1].name });
      } else {
        setUserName({ name: "U" });
      }
    } catch {
      setUserName({ name: "U" });
    }
  };
  const navigate = useNavigate();
  const handleProfileClick = () => {
    navigate("/create-profile");
  };

  return (
    <nav className="bg-[#4d92fa] h-[50px] text-white shadow-md">
      <div className="flex items-center justify-between h-full flex-row">
        <div className="flex items-center justify-left h-full pl-2">
          <Plane />
          <h1 className="text-2xl font-semibold pl-2">SkyTrip</h1>
        </div>
        <div>
          <div
            onClick={handleProfileClick}
            className="h-[40px] w-[40px] bg-[#1e941a] rounded-full mr-2 border-2 cursor-pointer"
          >
            {userName.name ? (
              <div className="flex items-center justify-center h-full w-full">
                <h1 className="text-2xl font-semibold text-white">
                  {userName.name.charAt(0).toUpperCase()}
                </h1>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                <h1 className="text-2xl font-semibold text-white">U</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
