const express = require("express");
const router = express.Router();

const {
  createDistributor,
  getAllDistributors,
  getDistributorById,
  updateDistributor,
  deleteDistributor,
} = require("../Controllers/distributorController");

// Create
router.post("/create", createDistributor);

// Read
router.get("/", getAllDistributors);
router.get("/:id", getDistributorById);

// Update
router.put("/:id", updateDistributor);

// Delete
router.delete("/:id", deleteDistributor);

module.exports = router;
