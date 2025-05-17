const router = require("express").Router();
const ProfileData = require("../models/profileData");

router.post("/", async (req, res) => {
  try {
    const profileData = await ProfileData.create(req.body);
    res.status(201).json(profileData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
