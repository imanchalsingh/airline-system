import React, { useEffect, useState } from "react";
import {
  Plane,
  MapPin,
  Calendar,
  Clock,
  Filter,
  Search,
  ChevronRight,
  Users,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight as RightIcon,
  Wifi,
  Coffee,
  X,
  Menu,
  Grid,
  List,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Flight {
  id: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  date: string;
  time: string;
  airline: string;
  price?: number;
  duration?: string;
  seatsAvailable?: number;
  status?: "scheduled" | "delayed" | "boarding" | "in-air" | "landed";
}

const Flights: React.FC = () => {
  const Navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("departure");
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [flightsPerPage] = useState(6); // Show only 6 flights per page

  // Fetch flight data from the server
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/flights");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Add mock data for demonstration
        const enhancedData = data.map((flight: Flight) => ({
          ...flight,
          price: Math.floor(Math.random() * 400) + 200,
          duration: `${Math.floor(Math.random() * 5) + 1}h ${Math.floor(
            Math.random() * 59
          )}m`,
          seatsAvailable: Math.floor(Math.random() * 50) + 10,
          status: ["scheduled", "boarding", "in-air", "landed"][
            Math.floor(Math.random() * 4)
          ],
          airline:
            flight.airline ||
            ["SkyLine", "Air Express", "Global Airways", "Pacific Airlines"][
              Math.floor(Math.random() * 4)
            ],
        }));

        setFlights(enhancedData);
        setFilteredFlights(enhancedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flight data:", error);
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  // Filter flights based on search term
  useEffect(() => {
    let results = flights;

    if (searchTerm) {
      results = results.filter(
        (flight) =>
          flight.flightNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          flight.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
          flight.arrival.toLowerCase().includes(searchTerm.toLowerCase()) ||
          flight.airline.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort flights
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case "departure":
          return a.departure.localeCompare(b.departure);
        case "arrival":
          return a.arrival.localeCompare(b.arrival);
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "price":
          return (a.price || 0) - (b.price || 0);
        default:
          return 0;
      }
    });

    setFilteredFlights(results);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [searchTerm, sortBy, flights]);

  // Get current flights for pagination
  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = filteredFlights.slice(
    indexOfFirstFlight,
    indexOfLastFlight
  );
  const totalPages = Math.ceil(filteredFlights.length / flightsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "boarding":
        return "bg-amber-100 text-amber-700";
      case "in-air":
        return "bg-emerald-100 text-emerald-700";
      case "landed":
        return "bg-green-100 text-green-700";
      case "delayed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock size={14} />;
      case "boarding":
        return <Users size={14} />;
      case "in-air":
        return <Plane size={14} />;
      case "landed":
        return <Shield size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAirlineLogo = (airline: string) => {
    const logos: Record<string, string> = {
      SkyLine: "bg-blue-100 text-blue-600",
      "Air Express": "bg-red-100 text-red-600",
      "Global Airways": "bg-purple-100 text-purple-600",
      "Pacific Airlines": "bg-cyan-100 text-cyan-600",
    };
    return logos[airline] || "bg-gray-100 text-gray-600";
  };

  const handleBookFlight = (flight: Flight) => {
    Navigate("/reservation", { state: { flight } });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 2) {
        pageNumbers.push(1, 2, 3);
        if (totalPages > 3) pageNumbers.push("...");
      } else if (currentPage >= totalPages - 1) {
        if (totalPages > 3) pageNumbers.push("...");
        pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        if (totalPages > 3) pageNumbers.push("...");
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
        if (totalPages > 3) pageNumbers.push("...");
      }
    }

    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Header */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Plane className="mr-2 text-blue-600" size={24} />
              <h1 className="text-2xl font-bold text-gray-800">Flights</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  setViewMode(viewMode === "list" ? "grid" : "list")
                }
                className="p-2 bg-white rounded-lg border border-gray-300"
              >
                {viewMode === "list" ? <Grid size={20} /> : <List size={20} />}
              </button>
              <button
                onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                className="p-2 bg-white rounded-lg border border-gray-300"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search flights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center">
                <Plane className="mr-3 text-blue-600" size={32} />
                Flight Schedule
              </h1>
              <p className="text-gray-600 mt-2">
                Browse and manage all available flights
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-blue-100">
                  <p className="text-sm text-gray-600">Total Flights</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {flights.length}
                  </p>
                </div>
                <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-blue-100">
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {flights.filter((f) => f.status === "in-air").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-4 md:p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search flights, cities, or airlines..."
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
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="departure">Sort by Departure</option>
                  <option value="arrival">Sort by Arrival</option>
                  <option value="date">Sort by Date</option>
                  <option value="price">Sort by Price</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center">
                  <Search className="mr-2" size={18} />
                  <span className="hidden sm:inline">Search</span>
                </button>
                <button className="px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <Calendar size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Flights List/Grid */}
          <div
            className={`${
              showMobileSidebar ? "hidden" : "block"
            } lg:block flex-1`}
          >
            {/* View Mode Toggle (Desktop) */}
            <div className="hidden lg:flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                Showing {Math.min(currentFlights.length, flightsPerPage)} of{" "}
                {filteredFlights.length} flights
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${
                    viewMode === "list"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <List size={20} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Grid size={20} />
                </button>
              </div>
            </div>

            {/* Grid View */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentFlights.map((flight) => (
                  <div
                    key={flight.id}
                    className={`bg-white rounded-xl shadow-lg border border-blue-100 p-4 hover:shadow-xl transition-shadow cursor-pointer ${
                      selectedFlight?.id === flight.id
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={() => setSelectedFlight(flight)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 ${getAirlineLogo(
                            flight.airline
                          )} rounded-lg flex items-center justify-center mr-3`}
                        >
                          <Plane size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {flight.flightNumber}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {flight.airline}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(
                          flight.status || "scheduled"
                        )}`}
                      >
                        {flight.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                          <ArrowUpRight
                            className="text-blue-500 mr-1"
                            size={14}
                          />
                          <span className="font-medium">
                            {flight.departure}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <ArrowDownRight
                            className="text-emerald-500 mr-1"
                            size={14}
                          />
                          <span className="font-medium">{flight.arrival}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(flight.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {formatTime(flight.time)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{flight.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <div className="text-sm text-gray-600">Seats</div>
                        <div className="font-semibold">
                          {flight.seatsAvailable}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Price</div>
                        <div className="text-lg font-bold text-blue-600">
                          ${flight.price}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookFlight(flight);
                        }}
                        className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                {/* Table Header (Desktop) */}
                <div className="hidden lg:block px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                    <div className="col-span-3">Flight Details</div>
                    <div className="col-span-2">Route</div>
                    <div className="col-span-2">Schedule</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Seats & Price</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                </div>

                {/* Flights List */}
                <div className="divide-y divide-gray-100">
                  {currentFlights.length === 0 ? (
                    <div className="py-12 text-center">
                      <Plane className="text-gray-300 mx-auto mb-4" size={48} />
                      <p className="text-gray-500 text-lg">No flights found</p>
                      {searchTerm && (
                        <p className="text-gray-400 mt-2">
                          Try adjusting your search criteria
                        </p>
                      )}
                    </div>
                  ) : (
                    currentFlights.map((flight) => (
                      <div
                        key={flight.id}
                        className={`p-4 lg:p-6 hover:bg-blue-50 transition-colors cursor-pointer ${
                          selectedFlight?.id === flight.id
                            ? "bg-blue-50 border-l-4 border-blue-500"
                            : ""
                        }`}
                        onClick={() => setSelectedFlight(flight)}
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                          {/* Flight Details */}
                          <div className="col-span-1 lg:col-span-3">
                            <div className="flex items-center">
                              <div
                                className={`w-10 h-10 ${getAirlineLogo(
                                  flight.airline
                                )} rounded-xl flex items-center justify-center mr-3`}
                              >
                                <Plane size={20} />
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 text-lg">
                                  {flight.flightNumber}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {flight.airline}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 text-sm lg:hidden">
                              <span className="text-gray-500">Duration: </span>
                              <span className="font-semibold">
                                {flight.duration}
                              </span>
                            </div>
                          </div>

                          {/* Route */}
                          <div className="col-span-1 lg:col-span-2">
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <ArrowUpRight
                                  className="text-blue-500 mr-2"
                                  size={16}
                                />
                                <span className="font-semibold">
                                  {flight.departure}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <ArrowDownRight
                                  className="text-emerald-500 mr-2"
                                  size={16}
                                />
                                <span className="font-semibold">
                                  {flight.arrival}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Schedule */}
                          <div className="col-span-1 lg:col-span-2">
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <Calendar
                                  className="text-gray-400 mr-2"
                                  size={14}
                                />
                                <span>{formatDate(flight.date)}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock
                                  className="text-gray-400 mr-2"
                                  size={14}
                                />
                                <span>{formatTime(flight.time)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="col-span-1 lg:col-span-2">
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                                flight.status || "scheduled"
                              )}`}
                            >
                              {getStatusIcon(flight.status || "scheduled")}
                              <span className="ml-2 capitalize hidden lg:inline">
                                {flight.status}
                              </span>
                              <span className="ml-2 capitalize lg:hidden">
                                {flight.status?.charAt(0).toUpperCase()}
                              </span>
                            </span>
                          </div>

                          {/* Seats & Price */}
                          <div className="col-span-1 lg:col-span-2">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-600">
                                  Seats:
                                </span>
                                <span className="font-semibold">
                                  {flight.seatsAvailable}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                  Price:
                                </span>
                                <span className="text-lg font-bold text-blue-600">
                                  ${flight.price}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="col-span-1 lg:col-span-1">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBookFlight(flight);
                                }}
                                className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all"
                              >
                                Book
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Amenities (Mobile) */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between lg:hidden">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <Wifi size={14} className="mr-1" />
                              <span>Wi-Fi</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Coffee size={14} className="mr-1" />
                              <span>Meal</span>
                            </div>
                          </div>
                          <button className="text-blue-600">
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {filteredFlights.length > flightsPerPage && (
                  <div className="px-4 lg:px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="text-sm text-gray-600">
                        Showing {indexOfFirstFlight + 1} to{" "}
                        {Math.min(indexOfLastFlight, filteredFlights.length)} of{" "}
                        {filteredFlights.length} flights
                      </p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          className={`p-2 border border-gray-300 rounded-lg transition-colors ${
                            currentPage === 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "hover:bg-white text-gray-700"
                          }`}
                        >
                          <ChevronLeft size={16} />
                        </button>

                        {getPageNumbers().map((pageNumber, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              typeof pageNumber === "number" &&
                              paginate(pageNumber)
                            }
                            className={`px-3 py-1 rounded-lg transition-colors ${
                              pageNumber === currentPage
                                ? "bg-blue-600 text-white"
                                : typeof pageNumber === "number"
                                ? "border border-gray-300 hover:bg-white text-gray-700"
                                : "text-gray-400 cursor-default"
                            }`}
                            disabled={typeof pageNumber !== "number"}
                          >
                            {pageNumber}
                          </button>
                        ))}

                        <button
                          onClick={nextPage}
                          disabled={currentPage === totalPages}
                          className={`p-2 border border-gray-300 rounded-lg transition-colors ${
                            currentPage === totalPages
                              ? "text-gray-400 cursor-not-allowed"
                              : "hover:bg-white text-gray-700"
                          }`}
                        >
                          <RightIcon size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div
            className={`${
              showMobileSidebar ? "block" : "hidden"
            } lg:block lg:w-80`}
          >
            <div className="lg:sticky lg:top-6 space-y-6">
              {/* Mobile Sidebar Header */}
              <div className="lg:hidden flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Flight Details
                </h3>
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="p-2 text-gray-600 hover:text-gray-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Selected Flight Details */}
              {selectedFlight ? (
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-blue-100 p-4 lg:p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Flight Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Flight Number</span>
                      <span className="font-semibold">
                        {selectedFlight.flightNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Airline</span>
                      <span className="font-semibold">
                        {selectedFlight.airline}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Departure</span>
                      <span className="font-semibold">
                        {selectedFlight.departure}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Arrival</span>
                      <span className="font-semibold">
                        {selectedFlight.arrival}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Date & Time</span>
                      <span className="font-semibold">
                        {formatDate(selectedFlight.date)}{" "}
                        {formatTime(selectedFlight.time)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-semibold">
                        {selectedFlight.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Seats Available</span>
                      <span className="font-semibold">
                        {selectedFlight.seatsAvailable}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status</span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          selectedFlight.status || "scheduled"
                        )}`}
                      >
                        {selectedFlight.status}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold">Total Price</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ${selectedFlight.price}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleBookFlight(selectedFlight)}
                          className="col-span-2 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                        >
                          Book This Flight
                        </button>

                        <button
                          onClick={() => setSelectedFlight(null)}
                          className="py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-blue-100 p-4 lg:p-6 text-center">
                  <Plane className="text-gray-300 mx-auto mb-4" size={48} />
                  <p className="text-gray-600">
                    Select a flight to view details
                  </p>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Today's Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-90">Flights Today</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">On Time</p>
                    <p className="text-2xl font-bold">92%</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Delayed</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Avg. Delay</p>
                    <p className="text-2xl font-bold">15m</p>
                  </div>
                </div>
              </div>

              {/* Popular Routes */}
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-blue-100 p-4 lg:p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Popular Routes
                </h3>
                <div className="space-y-3">
                  {[
                    { from: "NYC", to: "LAX", flights: 24 },
                    { from: "LON", to: "PAR", flights: 18 },
                    { from: "TOK", to: "SIN", flights: 15 },
                    { from: "DXB", to: "JED", flights: 12 },
                  ].map((route, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-xl transition-colors"
                    >
                      <div className="flex items-center">
                        <MapPin className="text-blue-500 mr-2" size={16} />
                        <span className="font-medium">
                          {route.from} → {route.to}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {route.flights} flights
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default Flights;
