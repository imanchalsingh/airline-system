import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Flights from "../SubSub-Components/Flights";
import Reservation from "../SubSub-Components/Reservation";
import MyBooking from "../SubSub-Components/MyBooking";
import MainWel from "../SubSub-Components/MainWel";
import AdminPanel from "../SubSub-Components/Admin";

const RouteCard: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.state?.isAdmin || false;
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const routeCards = [
    { id: 1, name: "Flights" },
    { id: 2, name: "Reservation" },
    { id: 3, name: "My Bookings" },
    ...(isAdmin ? [{ id: 4, name: "Admin" }] : []),
  ];

  return (
    <div className="flex flex-col items-center p-2 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
        {routeCards.map((card) => (
          <div
            key={card.id}
            onClick={() => setSelectedCard(card.id)}
            className={`cursor-pointer flex items-center justify-center p-3 m-2 rounded-lg shadow-md transition-colors duration-300 ${
              selectedCard === card.id
                ? "bg-green-600 text-white"
                : "bg-green-200"
            }`}
          >
            <h2 className="text-lg sm:text-lg">{card.name}</h2>
          </div>
        ))}
      </div>

      <div className="mt-6 w-full">
        {selectedCard === null && <MainWel />}
        {selectedCard === 1 && <Flights />}
        {selectedCard === 2 && <Reservation />}
        {selectedCard === 3 && <MyBooking />}
        {selectedCard === 4 && isAdmin && <AdminPanel />}
      </div>
    </div>
  );
};

export default RouteCard;
