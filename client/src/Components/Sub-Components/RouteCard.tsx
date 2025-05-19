import React, { useState } from "react";
import Flights from "../SubSub-Components/Flights";
import Reservation from "../SubSub-Components/Reservation";
import MyBooking from "../SubSub-Components/MyBooking";
import MainWel from "../SubSub-Components/MainWel";

const RouteCard: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const handleCardClick = (id: number) => {
    setSelectedCard(id);
  };

  const routeCards = [
    { id: 1, name: "Flights" },
    { id: 2, name: "Reservation" },
    { id: 3, name: "My Bookings" },
  ];

  return (
    <div className="flex flex-col items-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {routeCards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`cursor-pointer flex items-center justify-center p-4 m-2 rounded-lg shadow-md transition-colors duration-300 ${
              selectedCard === card.id
                ? "bg-green-600 text-white"
                : "bg-green-200"
            }`}
          >
            <h2>{card.name}</h2>
          </div>
        ))}
      </div>

      <div className="mt-6 w-full">
        {selectedCard === null && <MainWel />}
        {selectedCard === 1 && <Flights />}
        {selectedCard === 2 && <Reservation />}
        {selectedCard === 3 && <MyBooking />}
      </div>
    </div>
  );
};

export default RouteCard;
