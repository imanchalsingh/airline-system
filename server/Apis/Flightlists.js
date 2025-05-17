const express = require("express");
const router = express.Router();
const Flightlist = require("../JSONDATA/flightlists");

// GET /api/users → send JSON data
router.get("/", (req, res) => {
  res.json(Flightlist);
});

module.exports = router;
