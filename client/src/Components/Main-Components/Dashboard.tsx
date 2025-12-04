import React from "react";
import Navbar from "../Sub-Components/Navbar";
import CreateProfile from "../Sub-Components/CreateProfile";
import RouteCard from "../Sub-Components/RouteCard";
import { Routes, Route } from "react-router-dom";
import MainWel from "../SubSub-Components/MainPageAsDashboard";
import MyBooking from "../SubSub-Components/MyBooking";
import Flights from "../SubSub-Components/Flights";
import Reservation from "../SubSub-Components/Reservation";

const Dashboard: React.FC = () => {
  return (
    <div>
      <Navbar /> {/* Always visible */}
      <Routes>
        <Route path="/" element={<CreateProfile />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/route-card" element={<RouteCard />} />
        <Route path="/MainPageAsDashboard" element={<MainWel />} />
        <Route path="/my-booking" element={<MyBooking />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/admin-panel" element={<Flights />} />
        <Route path="/reservation" element={<Reservation />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
