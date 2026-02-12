const mongoose = require('mongoose');

const FinancialSchema = new mongoose.Schema({
    option:{
        type:String, 
        required:[true , "Please select atleast and atmost 1 type"],
        enum:["Annual Report" , "Financial Annual Report" , "Financial Of Subsidiaries Company" , "Financial Results", "Other"]
    },
     details: [
      {
        name: {
          type: String,
          required: [true, "Please enter the name"],
        },
        date: {
          type: String,
          required: [true, "Please enter the date"],
        },
        file: {
          type: String,
          required: false,
        },
        heading: {
          type: String,
          required: false,
        },
      },
    ],
} , {
    timestamps:true
});

const FinancialModel = mongoose.model("Financial" , FinancialSchema);
module.exports = FinancialModel;