import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Plane,
  Clock,
  User,
  Receipt,
  CreditCard,
  Download,
  Share2,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Filter,
  Search,
  Mail,
  Phone,
  QrCode,
  Bell,
  Trash2,
} from "lucide-react";

interface Booking {
  id: number;
  flightNumber: string;
  departure: string;
  arrival: string;
  date: string;
  time: string;
  airline: string;
  bookedAt: string;
  passengerCount?: number;
  totalPrice?: number;
  bookingStatus?: "confirmed" | "pending" | "cancelled";
  seatNumbers?: string[];
  bookingReference?: string;
  paymentMethod?: string;
}

const MyBooking: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    upcomingTrips: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("myBookings") || "[]");

    // Enhance stored data with mock details for demonstration
    const enhancedBookings = stored.map((booking: Booking, index: number) => ({
      ...booking,
      id: index + 1,
      passengerCount: Math.floor(Math.random() * 4) + 1,
      totalPrice: Math.floor(Math.random() * 1500) + 300,
      bookingStatus: [
        "confirmed",
        "confirmed",
        "confirmed",
        "pending",
        "cancelled",
      ][Math.floor(Math.random() * 5)],
      seatNumbers: Array.from(
        { length: Math.floor(Math.random() * 4) + 1 },
        () =>
          `${Math.floor(Math.random() * 30) + 1}${String.fromCharCode(
            65 + Math.floor(Math.random() * 6)
          )}`
      ),
      bookingReference: `REF-${Math.random()
        .toString(36)
        .substr(2, 8)
        .toUpperCase()}`,
      paymentMethod: ["Credit Card", "PayPal", "Bank Transfer"][
        Math.floor(Math.random() * 3)
      ],
    }));

    setBookings(enhancedBookings);
    setFilteredBookings(enhancedBookings);

    // Calculate stats
    const totalBookings = enhancedBookings.length;
    const totalSpent = enhancedBookings.reduce(
      (sum: number, b: Booking) => sum + (b.totalPrice || 0),
      0
    );
    const upcomingTrips = enhancedBookings.filter(
      (b: Booking) =>
        b.bookingStatus === "confirmed" && new Date(b.date) > new Date()
    ).length;
    const cancelled = enhancedBookings.filter(
      (b: Booking) => b.bookingStatus === "cancelled"
    ).length;

    setStats({ totalBookings, totalSpent, upcomingTrips, cancelled });
  }, []);

  // Filter and search bookings
  useEffect(() => {
    let results = bookings;

    if (searchTerm) {
      results = results.filter(
        (booking) =>
          booking.flightNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.arrival.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.bookingReference
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      results = results.filter(
        (booking) => booking.bookingStatus === filterStatus
      );
    }

    setFilteredBookings(results);
  }, [searchTerm, filterStatus, bookings]);

  const handleRemove = (id: number) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    const updated = bookings.filter((booking) => booking.id !== id);
    setBookings(updated);
    localStorage.setItem(
      "myBookings",
      JSON.stringify(updated.filter((b) => b.bookingStatus !== "cancelled"))
    );

    // Recalculate stats
    const totalBookings = updated.length;
    const totalSpent = updated.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const upcomingTrips = updated.filter(
      (b: Booking) =>
        b.bookingStatus === "confirmed" && new Date(b.date) > new Date()
    ).length;
    const cancelled = updated.filter(
      (b: Booking) => b.bookingStatus === "cancelled"
    ).length;

    setStats({ totalBookings, totalSpent, upcomingTrips, cancelled });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle size={14} />;
      case "pending":
        return <Clock size={14} />;
      case "cancelled":
        return <XCircle size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
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

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadTicket = (booking: Booking) => {
    alert(`Downloading ticket for ${booking.flightNumber}`);
    // Implement actual download logic here
  };

  const handleShareBooking = (booking: Booking) => {
    alert(`Sharing booking details for ${booking.flightNumber}`);
    // Implement actual share logic here
  };

  const calculateDaysUntil = (dateString: string) => {
    const today = new Date();
    const tripDate = new Date(dateString);
    const diffTime = tripDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center">
                <Receipt className="mr-3 text-blue-600" size={32} />
                My Bookings
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all your flight reservations in one place
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center">
                <Plus className="mr-2" size={18} />
                New Booking
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {stats.totalBookings}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Receipt className="text-blue-600" size={24} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  <span>+3 this month</span>
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Spent</p>
                  <p className="text-3xl font-bold mt-2">
                    ${stats.totalSpent.toLocaleString()}
                  </p>
                </div>
                <CreditCard size={32} className="opacity-80" />
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-xs flex items-center">
                  <BarChart3 size={12} className="mr-1" />
                  <span>Travel budget tracking</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming Trips</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {stats.upcomingTrips}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Calendar className="text-emerald-600" size={24} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-blue-600 flex items-center">
                  <Clock size={12} className="mr-1" />
                  <span>
                    Next trip in{" "}
                    {bookings.length > 0
                      ? calculateDaysUntil(bookings[0].date)
                      : 0}{" "}
                    days
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cancelled</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {stats.cancelled}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <XCircle className="text-red-600" size={24} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-600">Refund policy applies</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search bookings, flights, or destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="relative">
              <Filter
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center">
                <Search className="mr-2" size={18} />
                Search Bookings
              </button>
              <button className="px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bookings List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                  <div className="col-span-3">Flight Details</div>
                  <div className="col-span-2">Travel Details</div>
                  <div className="col-span-2">Booking Info</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-1">Actions</div>
                </div>
              </div>

              {/* Bookings List */}
              <div className="divide-y divide-gray-100">
                {filteredBookings.length === 0 ? (
                  <div className="py-12 text-center">
                    <Receipt className="text-gray-300 mx-auto mb-4" size={48} />
                    <p className="text-gray-500 text-lg">No bookings found</p>
                    {searchTerm && (
                      <p className="text-gray-400 mt-2">
                        Try adjusting your search criteria
                      </p>
                    )}
                  </div>
                ) : (
                  filteredBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className={`p-6 hover:bg-blue-50 transition-colors cursor-pointer ${
                        selectedBooking?.id === booking.id
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : ""
                      }`}
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Flight Details */}
                        <div className="col-span-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                              <Plane className="text-blue-600" size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">
                                {booking.flightNumber}
                              </p>
                              <p className="text-sm text-gray-600">
                                {booking.airline}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            <span className="text-gray-500">Ref: </span>
                            <span className="font-mono">
                              {booking.bookingReference}
                            </span>
                          </div>
                        </div>

                        {/* Travel Details */}
                        <div className="col-span-2">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <MapPin
                                className="text-blue-500 mr-2"
                                size={14}
                              />
                              <span className="font-medium">
                                {booking.departure}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <MapPin
                                className="text-emerald-500 mr-2"
                                size={14}
                              />
                              <span className="font-medium">
                                {booking.arrival}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="mr-1" size={12} />
                              <span>{booking.passengerCount} passenger(s)</span>
                            </div>
                          </div>
                        </div>

                        {/* Booking Info */}
                        <div className="col-span-2">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Calendar
                                className="text-gray-400 mr-2"
                                size={14}
                              />
                              <span>{formatDate(booking.date)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="text-gray-400 mr-2" size={14} />
                              <span>{formatTime(booking.time)}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Seats: {booking.seatNumbers?.join(", ")}
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(
                              booking.bookingStatus || "confirmed"
                            )}`}
                          >
                            {getStatusIcon(
                              booking.bookingStatus || "confirmed"
                            )}
                            <span className="ml-2 capitalize">
                              {booking.bookingStatus}
                            </span>
                          </span>
                        </div>

                        {/* Amount */}
                        <div className="col-span-2">
                          <div>
                            <p className="text-lg font-bold text-blue-600">
                              ${booking.totalPrice?.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              {booking.paymentMethod}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="col-span-1">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadTicket(booking);
                              }}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Download Ticket"
                            >
                              <Download size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(booking.id);
                              }}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                              title="Cancel Booking"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Selected Booking Details */}
              {selectedBooking ? (
                <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      Booking Details
                    </h3>
                    <span className="text-sm text-gray-500">
                      #{selectedBooking.bookingReference}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Flight Info */}
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Plane className="text-blue-600 mr-2" size={20} />
                          <span className="font-bold">
                            {selectedBooking.flightNumber}
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            selectedBooking.bookingStatus || "confirmed"
                          )}`}
                        >
                          {selectedBooking.bookingStatus?.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm text-gray-600">From</p>
                          <p className="font-semibold">
                            {selectedBooking.departure}
                          </p>
                        </div>
                        <ChevronRight className="text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">To</p>
                          <p className="font-semibold">
                            {selectedBooking.arrival}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(selectedBooking.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {formatTime(selectedBooking.time)}
                        </div>
                      </div>
                    </div>

                    {/* Passenger & Payment Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Passengers</p>
                        <p className="font-semibold">
                          {selectedBooking.passengerCount}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Seats</p>
                        <p className="font-semibold">
                          {selectedBooking.seatNumbers?.join(", ")}
                        </p>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Base Fare</span>
                          <span>
                            $
                            {((selectedBooking.totalPrice || 0) * 0.7).toFixed(
                              2
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Taxes & Fees</span>
                          <span>
                            $
                            {((selectedBooking.totalPrice || 0) * 0.2).toFixed(
                              2
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Service Charge</span>
                          <span>
                            $
                            {((selectedBooking.totalPrice || 0) * 0.1).toFixed(
                              2
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                          <span>Total</span>
                          <span className="text-blue-600">
                            ${selectedBooking.totalPrice?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 space-y-3">
                      <button
                        onClick={() => handleDownloadTicket(selectedBooking)}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center"
                      >
                        <Download className="mr-2" size={18} />
                        Download E-Ticket
                      </button>
                      <button
                        onClick={() => handleShareBooking(selectedBooking)}
                        className="w-full py-3 border border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center"
                      >
                        <Share2 className="mr-2" size={18} />
                        Share Booking
                      </button>
                      {selectedBooking.bookingStatus === "confirmed" && (
                        <button
                          onClick={() => handleRemove(selectedBooking.id)}
                          className="w-full py-3 border border-red-600 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all flex items-center justify-center"
                        >
                          <XCircle className="mr-2" size={18} />
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 text-center">
                  <Receipt className="text-gray-300 mx-auto mb-4" size={48} />
                  <p className="text-gray-600">
                    Select a booking to view details
                  </p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                    <div className="flex items-center">
                      <QrCode className="mr-3" size={18} />
                      <span>View QR Code</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                    <div className="flex items-center">
                      <Mail className="mr-3" size={18} />
                      <span>Email Ticket</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                    <div className="flex items-center">
                      <Bell className="mr-3" size={18} />
                      <span>Flight Alerts</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Support */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Need Help?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 hover:bg-blue-50 rounded-xl transition-colors">
                    <Phone className="text-blue-600 mr-3" size={18} />
                    <div>
                      <p className="font-medium">Call Support</p>
                      <p className="text-sm text-gray-600">+1 (800) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 hover:bg-blue-50 rounded-xl transition-colors">
                    <Mail className="text-blue-600 mr-3" size={18} />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-gray-600">
                        support@skylineair.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for Plus icon
const Plus: React.FC<{ size?: number; className?: string }> = ({
  size = 24,
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default MyBooking;
