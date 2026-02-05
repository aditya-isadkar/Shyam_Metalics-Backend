const mongoose = require("mongoose");
const distributorSchema = new mongoose.Schema({
    customerName : String,
    contactNumber :String , 
    district : String , 
    state: String
});
const distributorModel = mongoose.model("Distributor" , distributorSchema);
module.exports = distributorModel;