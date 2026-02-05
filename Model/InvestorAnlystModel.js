const mongoose = require("mongoose");

const InvestorAnalystSchema = new mongoose.Schema(
  {
    investor_analyst_details: [
      {
        titlename: {
          type: String,
          required: [true, "Please provide a title name"],
          default: "Investors/Analyst Meet",
        },
        investor_analyst_name: {
          type: String,
          required: [true, "Please enter the investor/analyst name"],
        },
        investor_analyst_date: {
          type: Date,
          required: [true, "Please enter the date"],
        },
        investor_analyst_file: {
          type: String,
          required: [true, "Please upload the file"],
        },
      },
    ],
  },
  { timestamps: true }
);

const InvestorAnalyst = mongoose.model("InvestorAnalyst", InvestorAnalystSchema);
module.exports = InvestorAnalyst;
