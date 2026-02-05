const Distributor = require("../Model/bussinessdirectory");

/**
 * Create Distributor
 */
exports.createDistributor = async (req, res) => {
  try {
    const { customerName, contactNumber, district, state } = req.body;

    if (!customerName || !contactNumber || !district || !state) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const distributor = await Distributor.create({
      customerName,
      contactNumber,
      district,
      state,
    });

    res.status(201).json({
      success: true,
      message: "Distributor created successfully",
      data: distributor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating distributor",
      error: error.message,
    });
  }
};

/**
 * Get All Distributors
 */
exports.getAllDistributors = async (req, res) => {
  try {
    console.log("disturbot data ")
    const distributors = await Distributor.find().sort({ createdAt: -1 });
    console.log(distributors );
    res.status(200).json({
      success: true,
      data: distributors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching distributors",
      error: error.message,
    });
  }
};

/**
 * Get Single Distributor
 */
exports.getDistributorById = async (req, res) => {
  try {
    const distributor = await Distributor.findById(req.params.id);

    if (!distributor) {
      return res.status(404).json({
        success: false,
        message: "Distributor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: distributor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching distributor",
      error: error.message,
    });
  }
};

/**
 * Update Distributor
 */
exports.updateDistributor = async (req, res) => {
  try {
    const updatedDistributor = await Distributor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedDistributor) {
      return res.status(404).json({
        success: false,
        message: "Distributor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Distributor updated successfully",
      data: updatedDistributor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating distributor",
      error: error.message,
    });
  }
};

/**
 * Delete Distributor
 */
exports.deleteDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findByIdAndDelete(req.params.id);

    if (!distributor) {
      return res.status(404).json({
        success: false,
        message: "Distributor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Distributor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting distributor",
      error: error.message,
    });
  }
};
