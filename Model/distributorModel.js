const mongoose = require("mongoose");

const distributorSchema = new mongoose.Schema({
  state: { type: String },
  district: { type: String },
  name: { type: String },
  number: { type: String },
});

module.exports = mongoose.model("DistributorProvider", distributorSchema);
