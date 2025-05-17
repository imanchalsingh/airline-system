import React, { useEffect } from "react";

interface Flight {
  id: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  date: string;
  time: string;
}

const Flights: React.FC = () => {
  const [flights, setFlights] = React.useState<Flight[]>([]);
  // Fetch flight data from the server
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/flights");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFlights(data);
      } catch (error) {
        console.error("Error fetching flight data:", error);
      }
    };

    fetchFlights();
  }, []);
  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col items-center bg-gradient-to-r from-blue-100 to-indigo-200 rounded-lg shadow-lg">
      <div className="grid grid-cols-3 gap-8 w-full">
        {flights.map((flight) => (
          <div
            key={flight.id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-[#4d92fa] mb-3">
              Flight Number:{" "}
              <span className="font-bold">{flight.flightNumber}</span>
            </h2>
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Departure:</span>{" "}
              {flight.departure}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Arrival:</span> {flight.arrival}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Date:</span> {flight.date}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Time:</span> {flight.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flights;
