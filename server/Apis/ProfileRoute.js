const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const USERS_PATH = path.join(__dirname, "../JSONDATA/users.json");

function readUsers() {
  if (!fs.existsSync(USERS_PATH)) return [];
  return JSON.parse(fs.readFileSync(USERS_PATH, "utf-8"));
}
function writeUsers(data) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(data, null, 2));
}

// Get all users
router.get("/", (req, res) => {
  res.json(readUsers());
});

// Delete user by email (or id)
router.delete("/:email", (req, res) => {
  const email = req.params.email;
  let users = readUsers();
  users = users.filter((u) => u.email !== email);
  writeUsers(users);
  res.json({ success: true });
});

// Add this POST route to create a new user/profile
router.post("/", (req, res) => {
  const user = req.body;
  if (!user || !user.email) {
    return res.status(400).json({ error: "Invalid user data" });
  }
  const users = readUsers();
  users.push(user);
  writeUsers(users);
  res.status(201).json({ success: true, user });
});

module.exports = router;
