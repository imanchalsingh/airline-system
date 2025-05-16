import React from "react";
import { Plane } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-[#4d92fa] h-[50px] text-white">
      <div className="flex items-center justify-between h-full flex-row">
        <div className="flex items-center justify-left h-full pl-2">
          <Plane />
          <h1 className="text-2xl font-semibold pl-2">Air Line Reservation</h1>
        </div>
        <div>
          <div className="h-[40px] w-[40px] bg-[#1e941a] rounded-full mr-2 border-2">
            <div className="flex items-center justify-center h-full w-full">
              <h1 className="text-2xl font-semibold text-white">A</h1>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
