const express = require("express");
const router = express.Router();
const distributorController = require("../Controllers/distributorProviderController");

// Create
router.post("/", distributorController.createDistributor);

// Get All
router.get("/", distributorController.getAllDistributors);

// Get Single
router.get("/:id", distributorController.getDistributorById);

// Update
router.put("/:id", distributorController.updateDistributor);

// Delete
router.delete("/:id", distributorController.deleteDistributor);

module.exports = router;
