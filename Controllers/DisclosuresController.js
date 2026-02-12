const uploadToS3 = require("../config/s3Uploader");
const DisclosuresModel = require("../Model/DisclosuresModel");

const createDisclosures = async (req, res) => {
  const { name, date, mainTitle, extraLink } = req.body;

  try {
    let url = null;
    if (req.file) {
      url = await uploadToS3(req.file, "diclosures");
    }

    // If extraLink provided, prefer it and ignore file
    const detailObj = {
      name: name || "",
      date: date || "'",
      file: url ? "" : extraLink,
      mainTitle: mainTitle || "",
      extraLink: extraLink || "",
    };

    const updatedDisclosures = await DisclosuresModel.findOneAndUpdate(
      {}, // find first document
      { $push: { detail: detailObj } },
      { new: true, upsert: true }
    );

    res.status(201).json({ message: "Disclosures added successfully", data: updatedDisclosures });
  } catch (error) {
    console.error("Error creating Disclosures:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const getDisclosures = async (req, res) => {
  try {
    const DisclosuresData = await DisclosuresModel.findOne().sort({ "detail.date": -1 });

    if (!DisclosuresData) {
      return res.status(404).json({
        message: "No Disclosures details found",
        data: [],
      });
    }

    res.status(200).json({
      message: "Disclosures fetched successfully",
      data: DisclosuresData.detail,
    });
  } catch (error) {
    console.error("Error fetching Disclosures:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteById = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "id is required" });
  try {
    const parent = await DisclosuresModel.findOne({ "detail._id": id });
    if (!parent) return res.status(404).json({ message: "Item not found" });
    await DisclosuresModel.updateOne({ _id: parent._id }, { $pull: { detail: { _id: id } } });
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateDisclosures = async (req, res) => {
  const { id } = req.params;
  const { name, date, mainTitle, extraLink } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "detail id is required",
    });
  }

  try {
    // Find parent document containing this detail
    const parent = await DisclosuresModel.findOne({
      "detail._id": id,
    });

    if (!parent) {
      return res.status(404).json({
        message: "Disclosures item not found",
      });
    }

    const updateFields = {};

    // Update text fields if provided
    if (name !== undefined)
      updateFields["detail.$.name"] = name;

    if (date !== undefined)
      updateFields["detail.$.date"] = date;

    if (mainTitle !== undefined)
      updateFields["detail.$.mainTitle"] = mainTitle;

    // Upload PDF if provided
    if (req.file) {
      const url = await uploadToS3(req.file, "disclosures");

      if (!url) {
        return res.status(500).json({
          message: "File upload failed",
        });
      }

      updateFields["detail.$.file"] = url;
    }

    // Update extraLink if provided
    if (extraLink !== undefined) {
      updateFields["detail.$.extraLink"] = extraLink;
    }

    // If nothing to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        message: "No fields provided to update",
      });
    }

    const updated = await DisclosuresModel.findOneAndUpdate(
      { "detail._id": id },
      { $set: updateFields },
      { new: true }
    );

    return res.status(200).json({
      message: "Disclosures updated successfully",
      data: updated,
    });

  } catch (error) {
    console.error("Error updating Disclosures:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



module.exports = {
  createDisclosures,
  getDisclosures,
  deleteById,
  updateDisclosures
};