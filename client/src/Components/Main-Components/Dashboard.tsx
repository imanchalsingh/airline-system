import React from "react";
import Navbar from "../Sub-Components/Navbar";
import CreateProfile from "../Sub-Components/CreateProfile";
import RouteCard from "../Sub-Components/RouteCard";
import { Routes, Route } from "react-router-dom";

const Dashboard: React.FC = () => {
  return (
    <div>
      <Navbar /> {/* Always visible */}
      <Routes>
        <Route path="/" element={<CreateProfile />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/route-card" element={<RouteCard />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
