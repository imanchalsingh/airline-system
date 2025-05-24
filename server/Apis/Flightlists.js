const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const FLIGHTS_PATH = path.join(__dirname, "../JSONDATA/flightlists.json");

// Helper to read/write JSON file
function readFlights() {
  return JSON.parse(fs.readFileSync(FLIGHTS_PATH, "utf-8"));
}
function writeFlights(data) {
  fs.writeFileSync(FLIGHTS_PATH, JSON.stringify(data, null, 2));
}

// Get all flights
router.get("/", (req, res) => {
  const flights = readFlights();
  res.json(flights);
});

// Add a flight
router.post("/", (req, res) => {
  const { flightNumber, departure, arrival, date, time, airline } = req.body;
  if (!flightNumber || !departure || !arrival || !date || !time || !airline) {
    return res.status(400).json({ error: "All fields required" });
  }
  const flights = readFlights();
  const newFlight = {
    id: flights.length ? flights[flights.length - 1].id + 1 : 1,
    flightNumber,
    departure,
    arrival,
    date,
    time,
    airline,
  };
  flights.push(newFlight);
  writeFlights(flights);
  res.status(201).json(newFlight);
});

module.exports = router;
