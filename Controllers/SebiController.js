const sebiModel = require("../Model/SebiOnlineDisputeModel");
const uploadtoS3 = require("../config/s3Uploader");

// Create SEBI entry
const createSebi = async (req, res) => {
  try {
    const { sebi_name, sebi_date, extra_link } = req.body;

    // Validate required fields only (date is optional)
    if (!sebi_name) {
      return res.status(400).json({ message: "Please provide sebi_name" });
    }

    // Upload file only if provided
    let fileUrl = null;
    if (req.file) {
      fileUrl = await uploadtoS3(req.file);
    }

    // If extra_link provided, prefer it and ignore file
    const detailObj = {
      sebi_name,
      sebi_date,
      sebi_file: extra_link ? null : fileUrl,
      extra_link: extra_link || null,
    };

    const updatedSebi = await sebiModel.findOneAndUpdate(
      {},
      { $push: { sebi_details: detailObj } },
      { new: true, upsert: true }
    );

    res.status(201).json({ message: "SEBI data added successfully", data: updatedSebi });
  } catch (error) {
    console.error("Error creating SEBI:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get SEBI details
const getSebi = async (req, res) => {
  try {
    const sebiData = await sebiModel.findOne().sort({"sebi_details.sebi_date":-1});

    if (!sebiData) {
      return res.status(404).json({
        message: "No SEBI details found",
        data: [],
      });
    }

    res.status(200).json({
      message: "SEBI fetched successfully",
      data: sebiData.sebi_details,
    });
  } catch (error) {
    console.error("Error fetching SEBI:", error);
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
    const parent = await sebiModel.findOne({ "sebi_details._id": id });
    if (!parent) return res.status(404).json({ message: "Item not found" });
    await sebiModel.updateOne({ _id: parent._id }, { $pull: { sebi_details: { _id: id } } });
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
// const updateSebiById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { sebi_name, sebi_date, extra_link } = req.body;

//     if (!id) {
//       return res.status(400).json({ message: "id is required" });
//     }

//     const parent = await sebiModel.findOne({ "sebi_details._id": id });
//     if (!parent) {
//       return res.status(404).json({ message: "SEBI entry not found" });
//     }

//     const updateFields = {};

//     // Always update sebi_name (required field)
//     if (sebi_name) {
//       updateFields["sebi_details.$.sebi_name"] = sebi_name;
//     }

//     // Update date (clear if empty)
//     if (sebi_date !== undefined) {
//       updateFields["sebi_details.$.sebi_date"] = sebi_date || null;
//     }

//     // Handle file upload
//     if (req.file) {
//       const fileUrl = await uploadtoS3(req.file);
//       console.log("Uploaded file URL:", fileUrl); 
//       updateFields["sebi_details.$.sebi_file"] = fileUrl;
//       // if file provided, clear extra_link unless it's also provided
//       if (!extra_link) updateFields["sebi_details.$.extra_link"] = null;
//     }

//     // Handle extra_link
//     if (extra_link) {
//       updateFields["sebi_details.$.extra_link"] = extra_link;
//       // prefer extra_link over file
//       updateFields["sebi_details.$.sebi_file"] = null;
//     }

//     // Ensure we have at least one field to update
//     if (Object.keys(updateFields).length === 0) {
//       return res.status(400).json({ message: "No fields to update" });
//     }

//     const updatedSebi = await sebiModel.findOneAndUpdate(
//       { "sebi_details._id": id },
//       { $set: updateFields },
//       { new: true }
//     );

//     return res.status(200).json({
//       message: "SEBI data updated successfully",
//       data: updatedSebi,
//     });
//   } catch (error) {
//     console.error("Error updating SEBI:", error);
//     return res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };
const updateSebiById = async (req, res) => {
  try {
    const { id } = req.params;
    const { sebi_name, sebi_date, extra_link } = req.body;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    let updateFields = {};

    if (sebi_name !== undefined) {
      updateFields["sebi_details.$.sebi_name"] = sebi_name;
    }

    if (sebi_date !== undefined) {
      updateFields["sebi_details.$.sebi_date"] = sebi_date || null;
    }

    // ✅ If new file uploaded
    if (req.file) {
      const fileUrl = await uploadtoS3(req.file);

      updateFields["sebi_details.$.sebi_file"] = fileUrl;
      updateFields["sebi_details.$.extra_link"] = null; // always clear link if file uploaded
    }

    // ✅ If extra_link provided
    if (extra_link) {
      updateFields["sebi_details.$.extra_link"] = extra_link;
      updateFields["sebi_details.$.sebi_file"] = ""; // clear file if link provided
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updated = await sebiModel.findOneAndUpdate(
      { "sebi_details._id": id },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "SEBI entry not found" });
    }

    res.status(200).json({
      message: "SEBI updated successfully",
      data: updated,
    });

  } catch (error) {
    console.error("Update SEBI Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { createSebi, getSebi, deleteById, updateSebiById };
