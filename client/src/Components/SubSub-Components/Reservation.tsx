import React, { useEffect, useState } from "react";
import {
  Plane,
  CreditCard,
  Smartphone,
  Globe,
  Clock,
  MapPin,
  CheckCircle,
  ArrowRight,
  Shield,
  Lock,
  Users,
  Ticket,
  Sparkles,
  Search,
  ChevronDown,
  Loader2,
  QrCode,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";

interface Flight {
  id: number;
  flightNumber: string;
  departure: string;
  arrival: string;
  date: string;
  time: string;
  airline: string;
  price?: number;
  seatsAvailable?: number;
  duration?: string;
}

interface Booking extends Flight {
  bookedAt: string;
}

const Reservation: React.FC = () => {
  const [flightData, setFlightData] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<string>("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [passengerCount, setPassengerCount] = useState(1);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedFlightDetails, setSelectedFlightDetails] =
    useState<Flight | null>(null);

  const paymentOptions = [
    {
      id: "credit",
      name: "Credit Card",
      icon: CreditCard,
      color: "from-[#F09848] to-[#ffb366]",
    },
    {
      id: "debit",
      name: "Debit Card",
      icon: CreditCard,
      color: "from-green-500 to-emerald-600",
    },
    {
      id: "upi",
      name: "UPI",
      icon: Smartphone,
      color: "from-purple-500 to-pink-600",
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: Globe,
      color: "from-[#F09848] to-[#ffb366]",
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: Globe,
      color: "from-blue-400 to-cyan-500",
    },
  ];

  useEffect(() => {
    const fetchFlightData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/flights");
        const data = await response.json();

        // Add mock data for demonstration
        const enhancedData = data.map((flight: Flight) => ({
          ...flight,
          price: Math.floor(Math.random() * 400) + 200,
          seatsAvailable: Math.floor(Math.random() * 30) + 10,
          duration: `${Math.floor(Math.random() * 5) + 1}h ${Math.floor(
            Math.random() * 59
          )}m`,
          airline:
            flight.airline ||
            ["SkyLine", "Air Express", "Global Airways", "Pacific Airlines"][
              Math.floor(Math.random() * 4)
            ],
        }));

        setFlightData(enhancedData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchFlightData();
  }, []);

  useEffect(() => {
    if (selectedFlight) {
      const flight = flightData.find((f) => f.flightNumber === selectedFlight);
      setSelectedFlightDetails(flight || null);
      setAmount(flight?.price?.toString() || "");
    }
  }, [selectedFlight, flightData]);

  const handleBooking = () => {
    if (!selectedFlightDetails) {
      alert("Please select a flight first");
      return;
    }
    setBookingStep(2); // Move to payment step
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }
    
    if (!accountNumber || !amount) {
      alert("Please enter account number and amount");
      return;
    }

    const now = new Date();
    const bookedAt = now.toLocaleString();

    const newBooking: Booking & {
      paymentMethod: string;
      accountNumber: string;
      amount: string;
      passengerCount: number;
    } = {
      ...selectedFlightDetails!,
      bookedAt,
      paymentMethod,
      accountNumber,
      amount,
      passengerCount,
    };

    const existing = JSON.parse(localStorage.getItem("myBookings") || "[]");
    existing.push(newBooking);
    localStorage.setItem("myBookings", JSON.stringify(existing));

    setShowSuccessDialog(true);
    setAccountNumber("");
    setAmount("");
    setBookingStep(1);
  };

  const handleReset = () => {
    setSelectedFlight("");
    setSelectedFlightDetails(null);
    setPaymentMethod("");
    setBookingStep(1);
    setPassengerCount(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateTotal = () => {
    const basePrice = selectedFlightDetails?.price || 0;
    const taxes = basePrice * 0.18;
    const serviceFee = 15;
    return {
      base: basePrice,
      taxes,
      serviceFee,
      total: basePrice + taxes + serviceFee,
    };
  };

  const getAirlineLogo = (airline: string) => {
    const logos: Record<string, string> = {
      SkyLine: "text-[#F09848]",
      "Air Express": "text-red-400",
      "Global Airways": "text-purple-400",
      "Pacific Airlines": "text-cyan-400",
    };
    return logos[airline] || "text-[#b0c4c4]";
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-[#182850] to-[#0f1c42]">
        <div className="text-center">
          <Loader2
            className="animate-spin text-[#F09848] mx-auto mb-4"
            size={40}
          />
          <p className="text-[#b0c4c4]">Loading available flights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#182850] to-[#0f1c42] p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#E8F0F0] flex items-center justify-center">
            <Ticket className="mr-3 text-[#F09848]" size={32} />
            Flight Reservation
            <Sparkles className="ml-3 text-[#F09848]" size={24} />
          </h1>
          <p className="text-[#b0c4c4] mt-2">
            Book your next journey with ease and confidence
          </p>
        </div>

        {/* Booking Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex flex-col items-center ${
                    step <= bookingStep ? "text-[#F09848]" : "text-[#4a5a8a]"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step <= bookingStep
                        ? "bg-[#F09848] text-[#182850]"
                        : "bg-[#2a3a6a]"
                    } font-bold text-lg shadow-md transition-all duration-300 border border-[#F09848]/30`}
                  >
                    {step === 1 && <Search size={20} />}
                    {step === 2 && <CreditCard size={20} />}
                    {step === 3 && <CheckCircle size={20} />}
                  </div>
                  <span className="mt-2 text-sm font-medium text-[#E8F0F0]">
                    {step === 1
                      ? "Select Flight"
                      : step === 2
                      ? "Payment"
                      : "Confirm"}
                  </span>
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 md:w-24 h-1 mx-4 ${
                      step < bookingStep ? "bg-[#F09848]" : "bg-[#2a3a6a]"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Flight Selection */}
          <div className="lg:col-span-2">
            <div className="bg-[#1e3058] rounded-2xl shadow-lg border border-[#2a3a6a] p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#E8F0F0] mb-2">
                  Step {bookingStep === 1 ? "1" : bookingStep === 2 ? "2" : "3"}
                  :{bookingStep === 1 && " Select Your Flight"}
                  {bookingStep === 2 && " Complete Payment"}
                  {bookingStep === 3 && " Booking Confirmation"}
                </h2>
                <p className="text-[#b0c4c4]">
                  {bookingStep === 1 && "Choose from available flights below"}
                  {bookingStep === 2 && "Select your preferred payment method"}
                  {bookingStep === 3 && "Review and confirm your booking"}
                </p>
              </div>

              {bookingStep === 1 && (
                <>
                  {/* Flight Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#E8F0F0] mb-3">
                      <div className="flex items-center">
                        <Plane className="mr-2 text-[#F09848]" size={18} />
                        Select Flight
                        <span className="text-red-400 ml-1">*</span>
                      </div>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedFlight}
                        onChange={(e) => setSelectedFlight(e.target.value)}
                        className="w-full p-4 pl-12 border border-[#2a3a6a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F09848] focus:border-[#F09848] appearance-none bg-[#1e3058] text-[#E8F0F0]"
                      >
                        <option value="" className="bg-[#1e3058]">Choose a flight...</option>
                        {flightData.map((flight) => (
                          <option key={flight.id} value={flight.flightNumber} className="bg-[#1e3058]">
                            {flight.flightNumber} • {flight.departure} →{" "}
                            {flight.arrival} • {formatDate(flight.date)} • $
                            {flight.price}
                          </option>
                        ))}
                      </select>
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#F09848]">
                        <Plane size={20} />
                      </div>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#7a8ab8] pointer-events-none">
                        <ChevronDown size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Passenger Count */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#E8F0F0] mb-3">
                      <div className="flex items-center">
                        <Users className="mr-2 text-[#F09848]" size={18} />
                        Number of Passengers
                      </div>
                    </label>
                    <div className="flex items-center space-x-4">
                      {[1, 2, 3, 4].map((count) => (
                        <button
                          key={count}
                          onClick={() => setPassengerCount(count)}
                          className={`px-4 py-2 rounded-lg border transition-all ${
                            passengerCount === count
                              ? "bg-[#F09848] text-[#182850] border-[#F09848]"
                              : "border-[#2a3a6a] hover:border-[#F09848] text-[#b0c4c4]"
                          }`}
                        >
                          {count} {count === 1 ? "Passenger" : "Passengers"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Flight Details */}
                  {selectedFlightDetails && (
                    <div className="bg-gradient-to-r from-[#1e3058] to-[#2a3a6a] rounded-2xl p-6 border border-[#2a3a6a] mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div
                            className={`w-12 h-12 ${getAirlineLogo(
                              selectedFlightDetails.airline
                            )} ${getAirlineLogo(
                              selectedFlightDetails.airline
                            ).replace('text-', 'bg-')}/20 rounded-xl flex items-center justify-center mr-4 border ${
                              getAirlineLogo(
                                selectedFlightDetails.airline
                              ) === 'text-[#F09848]'
                                ? 'border-[#F09848]/30'
                                : getAirlineLogo(
                                    selectedFlightDetails.airline
                                  ) === 'text-red-400'
                                ? 'border-red-400/30'
                                : getAirlineLogo(
                                    selectedFlightDetails.airline
                                  ) === 'text-purple-400'
                                ? 'border-purple-400/30'
                                : 'border-cyan-400/30'
                            }`}
                          >
                            <Plane size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-[#E8F0F0]">
                              {selectedFlightDetails.flightNumber}
                            </h3>
                            <p className="text-[#b0c4c4]">
                              {selectedFlightDetails.airline}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#F09848]">
                            ${selectedFlightDetails.price}
                          </p>
                          <p className="text-sm text-[#b0c4c4]">per passenger</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-[#1e3058] rounded-xl border border-[#2a3a6a]">
                          <div className="flex items-center mb-2">
                            <MapPin className="text-[#F09848] mr-2" size={18} />
                            <span className="font-semibold text-[#E8F0F0]">Departure</span>
                          </div>
                          <p className="text-[#E8F0F0]">
                            {selectedFlightDetails.departure}
                          </p>
                        </div>

                        <div className="p-4 bg-[#1e3058] rounded-xl border border-[#2a3a6a]">
                          <div className="flex items-center mb-2">
                            <MapPin
                              className="text-green-400 mr-2"
                              size={18}
                            />
                            <span className="font-semibold text-[#E8F0F0]">Arrival</span>
                          </div>
                          <p className="text-[#E8F0F0]">
                            {selectedFlightDetails.arrival}
                          </p>
                        </div>

                        <div className="p-4 bg-[#1e3058] rounded-xl border border-[#2a3a6a]">
                          <div className="flex items-center mb-2">
                            <Clock className="text-[#F09848] mr-2" size={18} />
                            <span className="font-semibold text-[#E8F0F0]">Duration</span>
                          </div>
                          <p className="text-[#E8F0F0]">
                            {selectedFlightDetails.duration}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#2a3a6a]">
                        <div>
                          <p className="text-sm text-[#b0c4c4]">Date & Time</p>
                          <p className="font-semibold text-[#E8F0F0]">
                            {formatDate(selectedFlightDetails.date)} •{" "}
                            {selectedFlightDetails.time}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#b0c4c4]">
                            Seats Available
                          </p>
                          <p className="font-semibold text-green-400">
                            {selectedFlightDetails.seatsAvailable}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button
                      onClick={handleBooking}
                      disabled={!selectedFlightDetails}
                      className={`flex-1 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center ${
                        selectedFlightDetails
                          ? "bg-gradient-to-r from-[#F09848] to-[#ffb366] text-[#182850] hover:shadow-lg hover:scale-[1.02] hover:from-[#e8893a] hover:to-[#ffa754]"
                          : "bg-[#2a3a6a] text-[#7a8ab8] cursor-not-allowed"
                      }`}
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="ml-2" size={20} />
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-6 py-3.5 border border-[#2a3a6a] text-[#b0c4c4] rounded-xl hover:bg-[#2a3a6a] transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </>
              )}

              {bookingStep === 2 && selectedFlightDetails && (
                <div className="space-y-6">
                  {/* Payment Method Selection */}
                  <div>
                    <h3 className="text-lg font-bold text-[#E8F0F0] mb-4">
                      Select Payment Method
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {paymentOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setPaymentMethod(option.id)}
                          className={`p-4 rounded-xl border transition-all ${
                            paymentMethod === option.id
                              ? "ring-2 ring-[#F09848] ring-offset-2 border-[#F09848]"
                              : "border-[#2a3a6a] hover:border-[#F09848]"
                          }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center mx-auto mb-3 border border-white/30`}
                          >
                            <option.icon className="text-white" size={24} />
                          </div>
                          <p className="text-sm font-medium text-center text-[#E8F0F0]">
                            {option.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Details Form */}
                  {paymentMethod && (
                    <div className="bg-[#2a3a6a] rounded-2xl p-6 border border-[#2a3a6a]">
                      <h3 className="text-lg font-bold text-[#E8F0F0] mb-4">
                        Payment Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#E8F0F0] mb-2">
                            Account/Card Number
                          </label>
                          <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="Enter your account or card number"
                            className="w-full p-3 border border-[#2a3a6a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F09848] focus:border-[#F09848] bg-[#1e3058] text-[#E8F0F0] placeholder-[#7a8ab8]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#E8F0F0] mb-2">
                            Amount
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a8ab8]">
                              $
                            </span>
                            <input
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="w-full pl-8 p-3 border border-[#2a3a6a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F09848] focus:border-[#F09848] bg-[#1e3058] text-[#E8F0F0]"
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-[#b0c4c4]">
                          <Shield className="mr-2 text-green-400" size={16} />
                          <span>
                            Your payment is secured with 256-bit encryption
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div className="bg-[#1e3058] rounded-2xl border border-[#2a3a6a] p-6">
                    <h3 className="text-lg font-bold text-[#E8F0F0] mb-4">
                      Price Breakdown
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[#b0c4c4]">
                          Base Fare ({passengerCount} × $
                          {selectedFlightDetails.price})
                        </span>
                        <span className="font-semibold text-[#E8F0F0]">
                          ${(selectedFlightDetails.price || 0) * passengerCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b0c4c4]">
                          Taxes & Fees (18%)
                        </span>
                        <span className="font-semibold text-[#E8F0F0]">
                          $
                          {(
                            (selectedFlightDetails.price || 0) *
                            passengerCount *
                            0.18
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b0c4c4]">Service Fee</span>
                        <span className="font-semibold text-[#E8F0F0]">$15.00</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-[#2a3a6a]">
                        <span className="text-lg font-bold text-[#E8F0F0]">Total Amount</span>
                        <span className="text-2xl font-bold text-[#F09848]">
                          ${calculateTotal().total * passengerCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={() => setBookingStep(1)}
                      className="px-6 py-3.5 border border-[#2a3a6a] text-[#b0c4c4] rounded-xl hover:bg-[#2a3a6a] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={!accountNumber || !paymentMethod}
                      className={`flex-1 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center ${
                        accountNumber && paymentMethod
                          ? "bg-gradient-to-r from-[#F09848] to-[#ffb366] text-[#182850] hover:shadow-lg hover:scale-[1.02] hover:from-[#e8893a] hover:to-[#ffa754]"
                          : "bg-[#2a3a6a] text-[#7a8ab8] cursor-not-allowed"
                      }`}
                    >
                      <Lock className="mr-2" size={20} />
                      <span>Pay & Confirm Booking</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Information Panel */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Booking Summary */}
              {selectedFlightDetails && (
                <div className="bg-[#1e3058] rounded-2xl shadow-lg border border-[#2a3a6a] p-6">
                  <h3 className="text-lg font-bold text-[#E8F0F0] mb-4">
                    Booking Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[#b0c4c4]">Flight</span>
                      <span className="font-semibold text-[#E8F0F0]">
                        {selectedFlightDetails.flightNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#b0c4c4]">Passengers</span>
                      <span className="font-semibold text-[#E8F0F0]">{passengerCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#b0c4c4]">Date</span>
                      <span className="font-semibold text-[#E8F0F0]">
                        {formatDate(selectedFlightDetails.date)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#b0c4c4]">Time</span>
                      <span className="font-semibold text-[#E8F0F0]">
                        {selectedFlightDetails.time}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-[#2a3a6a]">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#E8F0F0]">Total</span>
                        <span className="text-2xl font-bold text-[#F09848]">
                          ${calculateTotal().total * passengerCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Benefits */}
              <div className="bg-gradient-to-r from-[#182850] to-[#2a3a6a] rounded-2xl shadow-lg p-6 text-[#E8F0F0] border border-[#F09848]/30">
                <h3 className="text-lg font-bold mb-4">Booking Benefits</h3>
                <div className="space-y-3">
                  {[
                    { icon: Shield, text: "Free cancellation within 24 hours" },
                    { icon: BadgeCheck, text: "Instant e-ticket delivery" },
                    { icon: QrCode, text: "Mobile boarding pass" },
                    { icon: Users, text: "24/7 customer support" },
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <benefit.icon className="mr-3" size={18} />
                      <span className="text-sm">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Need Help */}
              <div className="bg-[#1e3058] rounded-2xl shadow-lg border border-[#2a3a6a] p-6">
                <h3 className="text-lg font-bold text-[#E8F0F0] mb-4">
                  Need Help?
                </h3>
                <div className="space-y-3">
                  <button className="w-full p-3 text-left bg-[#2a3a6a] text-[#F09848] rounded-xl hover:bg-[#2a3a6a]/80 transition-colors">
                    <div className="flex items-center">
                      <AlertCircle className="mr-3" size={18} />
                      <span>Booking Assistance</span>
                    </div>
                  </button>
                  <button className="w-full p-3 text-left bg-[#2a3a6a] text-[#F09848] rounded-xl hover:bg-[#2a3a6a]/80 transition-colors">
                    <div className="flex items-center">
                      <CreditCard className="mr-3" size={18} />
                      <span>Payment Issues</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e3058] rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn border border-[#F09848]/30">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#F09848] to-[#ffb366] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#F09848]/30">
                <CheckCircle className="text-[#182850]" size={40} />
              </div>

              <h2 className="text-2xl font-bold text-[#E8F0F0] mb-3">
                Booking Confirmed! 🎉
              </h2>
              <p className="text-[#b0c4c4] mb-6">
                Your flight has been successfully booked. E-ticket has been sent
                to your email.
              </p>

              {selectedFlightDetails && (
                <div className="bg-[#2a3a6a] rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#b0c4c4]">Flight Number</span>
                    <span className="font-bold text-[#E8F0F0]">
                      {selectedFlightDetails.flightNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#b0c4c4]">Route</span>
                    <span className="font-bold text-[#E8F0F0]">
                      {selectedFlightDetails.departure} →{" "}
                      {selectedFlightDetails.arrival}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#b0c4c4]">Total Amount</span>
                    <span className="font-bold text-[#F09848]">
                      ${calculateTotal().total * passengerCount}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowSuccessDialog(false);
                    handleReset();
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-[#F09848] to-[#ffb366] text-[#182850] font-semibold rounded-xl hover:shadow-lg transition-all hover:from-[#e8893a] hover:to-[#ffa754]"
                >
                  Book Another Flight
                </button>
                <button
                  onClick={() => {
                    setShowSuccessDialog(false);
                    handleReset();
                  }}
                  className="flex-1 py-3 border border-[#F09848] text-[#F09848] font-semibold rounded-xl hover:bg-[#F09848]/10 transition-colors"
                >
                  View My Bookings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animation */}
      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Reservation;