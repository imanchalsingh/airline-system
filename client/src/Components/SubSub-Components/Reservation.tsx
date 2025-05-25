import React, { useEffect, useState } from "react";

interface Flight {
  id: number;
  flightNumber: string;
  departure: string;
  arrival: string;
  date: string;
  time: string;
  airline: string;
}

interface Booking extends Flight {
  bookedAt: string;
}

const Reservation: React.FC = () => {
  const [flightData, setFlightData] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<string>("");
  const [showDialog, setShowDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [paymentError, setPaymentError] = useState<string>("");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDetailsError, setPaymentDetailsError] = useState("");

  const paymentOptions = [
    "Credit Card",
    "Debit Card",
    "UPI",
    "Net Banking",
    "PayPal",
  ];

  useEffect(() => {
    const fetchFlightData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/flights");
        const data = await response.json();
        setFlightData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFlightData();
  }, []);

  const selected = flightData.find(
    (flight) => flight.flightNumber === selectedFlight
  );

  const handleBooking = () => {
    if (!selected) return;
    if (!paymentMethod) {
      setPaymentError("Please select a payment method to proceed.");
      return;
    }
    setPaymentError("");
    setShowPaymentDialog(true); // Show payment dialog
  };

  const handlePayment = () => {
    if (!accountNumber || !amount) {
      setPaymentDetailsError("Please enter account number and amount.");
      return;
    }
    setPaymentDetailsError("");

    const now = new Date();
    const bookedAt = now.toLocaleString();

    const newBooking: Booking & {
      paymentMethod: string;
      accountNumber: string;
      amount: string;
    } = {
      ...selected!,
      bookedAt,
      paymentMethod,
      accountNumber,
      amount,
    };

    const existing = JSON.parse(localStorage.getItem("myBookings") || "[]");
    existing.push(newBooking);
    localStorage.setItem("myBookings", JSON.stringify(existing));

    setShowPaymentDialog(false);
    setShowDialog(true);
    setAccountNumber("");
    setAmount("");
  };

  const handleReset = () => {
    setSelectedFlight("");
  };

  return (
    <div className=" flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-[#448fff] mb-6">
          ✈️ Flight Reservation
        </h1>

        <label
          htmlFor="flight-select"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Select Flight Number
        </label>

        <select
          id="flight-select"
          value={selectedFlight}
          onChange={(e) => setSelectedFlight(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#73aafd] transition"
        >
          <option value="">-- Choose a flight --</option>
          {flightData.map((flight) => (
            <option key={flight.id} value={flight.flightNumber}>
              {flight.flightNumber}
            </option>
          ))}
        </select>

        {/* Payment Method Dropdown */}
        {selected && (
          <>
            <label
              htmlFor="payment-method"
              className="block mt-4 mb-2 text-sm font-medium text-gray-700"
            >
              Select Payment Method <span className="text-red-500">*</span>
            </label>
            <select
              id="payment-method"
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPaymentError("");
              }}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#73aafd] transition"
            >
              <option value="">-- Choose payment method --</option>
              {paymentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {paymentError && (
              <div className="text-red-500 text-sm mt-1">{paymentError}</div>
            )}
          </>
        )}

        {selected && (
          <>
            {/* ...existing flight details and buttons... */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Flight Details
              </h3>
              <ul className="text-gray-700 space-y-1">
                <li>
                  <strong>From:</strong> {selected.departure}
                </li>
                <li>
                  <strong>To:</strong> {selected.arrival}
                </li>
                <li>
                  <strong>Date:</strong> {selected.date}
                </li>
                <li>
                  <strong>Time:</strong> {selected.time}
                </li>
                <li>
                  <strong>Airline:</strong> {selected.airline}
                </li>
              </ul>
            </div>

            <div className="mt-6 flex gap-4 justify-between">
              <button
                onClick={handleBooking}
                className="flex-1 bg-[#4d92fa] text-white py-2 px-2 rounded-lg hover:bg-[#4d92fae2] transition cursor-pointer"
                disabled={!paymentMethod}
              >
                ✅ Book Now
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-300 text-gray-800 py-2 px-2 rounded-lg hover:bg-gray-400 transition cursor-pointer"
              >
                🔄 Reset
              </button>
            </div>
          </>
        )}
      </div>
      {/* ✅ Dialog Box */}
      {showDialog && (
        <div className="fixed inset-0 bg-[#70a9ff79] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h2 className="text-xl font-semibold text-green-600 mb-4">
              ✅ Booking Confirmed!
            </h2>
            <p className="text-gray-700 mb-4">
              Your flight has been successfully booked.
            </p>
            <button
              onClick={() => {
                setShowDialog(false);
                setSelectedFlight("");
              }}
              className="bg-[#4d92fa] text-white px-6 py-2 rounded hover:bg-[#4d92fafb] transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Payment Dialog */}
      {showPaymentDialog && (
        <div className="fixed inset-0 bg-[#70a9ff79] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
              💳 Enter Payment Details
            </h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 mb-2 border rounded"
              />
              {paymentDetailsError && (
                <div className="text-red-500 text-sm">{paymentDetailsError}</div>
              )}
            </div>
            <button
              onClick={handlePayment}
              className="bg-[#4d92fa] text-white px-6 py-2 rounded hover:bg-[#4d92fafb] transition cursor-pointer mr-2"
            >
              Pay & Confirm
            </button>
            <button
              onClick={() => setShowPaymentDialog(false)}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservation;
