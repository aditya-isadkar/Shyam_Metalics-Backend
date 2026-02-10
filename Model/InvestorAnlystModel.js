const mongoose = require("mongoose");

const InvestorAnalystDetailSchema = new mongoose.Schema(
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
  { _id: true } 
);

const InvestorAnalystSchema = new mongoose.Schema(
  {
    investor_analyst_details: [InvestorAnalystDetailSchema],
  },
  { timestamps: true }
);

const InvestorAnalyst = mongoose.model(
  "InvestorAnalyst",
  InvestorAnalystSchema
);

module.exports = InvestorAnalyst;
