const InvestorAnalyst = require("../Model/InvestorAnlystModel");
const uploadtoS3 = require("../config/s3Uploader");

// ======================== CREATE / ADD INVESTOR ANALYST ========================
const createInvestorAnalyst = async (req, res) => {
  try {
    const { titlename, investor_analyst_name, investor_analyst_date } = req.body;

    if (!investor_analyst_name || !investor_analyst_date || !req.file) {
      return res.status(400).json({
        message: "Please provide name, date, and a file",
      });
    }

    // Upload file
    const fileUrl = await uploadtoS3(req.file);

    // Add entry to the document (create if none exists)
    const updatedDoc = await InvestorAnalyst.findOneAndUpdate(
      {},
      {
        $push: {
          investor_analyst_details: {
            titlename: titlename || "Investors/Analyst Meet",
            investor_analyst_name,
            investor_analyst_date,
            investor_analyst_file: fileUrl,
          },
        },
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: "Investor/Analyst detail added successfully",
      data: updatedDoc,
    });
  } catch (error) {
    console.error("Error creating Investor/Analyst:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ======================== GET ALL INVESTOR ANALYST DETAILS ========================
const getInvestorAnalyst = async (req, res) => {
  try {
    const doc = await InvestorAnalyst.findOne();
    if (!doc) return res.status(404).json({ message: "No entries found", data: [] });

    // Sort by date descending
    const sortedDetails = doc.investor_analyst_details.sort(
      (a, b) => new Date(b.investor_analyst_date) - new Date(a.investor_analyst_date)
    );

    res.status(200).json({
      message: "Fetched successfully",
      data: sortedDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ======================== DELETE BY DETAIL ID ========================
const deleteById = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "ID is required" });

  try {
    const parent = await InvestorAnalyst.findOne({ "investor_analyst_details._id": id });
    if (!parent) return res.status(404).json({ message: "Item not found" });

    await InvestorAnalyst.updateOne(
      { _id: parent._id },
      { $pull: { investor_analyst_details: { _id: id } } }
    );

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================== UPDATE INVESTOR ANALYST DETAIL ========================
const updateInvestorAnalyst = async (req, res) => {
  const { id } = req.params;
  const { titlename, investor_analyst_name, investor_analyst_date } = req.body;
  console.log("Update request received for ID:", id);
  if (!id) return res.status(400).json({ message: "Detail ID is required" });

  try {
    const parent = await InvestorAnalyst.findOne({ "investor_analyst_details._id": id });
    console.log("Parent document found for update:", parent);
    if (!parent) return res.status(404).json({ message: "Item not found" });

    const updateFields = {};
    if (titlename) updateFields["investor_analyst_details.$.titlename"] = titlename;
    if (investor_analyst_name)
      updateFields["investor_analyst_details.$.investor_analyst_name"] = investor_analyst_name;
    if (investor_analyst_date)
      updateFields["investor_analyst_details.$.investor_analyst_date"] = investor_analyst_date;

    if (req.file) {
      const fileUrl = await uploadtoS3(req.file);
      if (!fileUrl) return res.status(500).json({ message: "File upload failed" });
      updateFields["investor_analyst_details.$.investor_analyst_file"] = fileUrl;
    }

    const updated = await InvestorAnalyst.findOneAndUpdate(
      { "investor_analyst_details._id": id },
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({
      message: "Investor/Analyst detail updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  createInvestorAnalyst,
  getInvestorAnalyst,
  deleteById,
  updateInvestorAnalyst,
};
