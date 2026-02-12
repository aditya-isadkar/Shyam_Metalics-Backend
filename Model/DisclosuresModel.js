const mongoose = require("mongoose");
const DisclosuresSchema = new mongoose.Schema({
    detail:[
        {
            name:{
                type:String ,
                required:false
            },
            date:{
                type:String ,
                required:false
            },
            file:{
                type:String,
                required:false
            },
            mainTitle: {
                type: String,
                enum: [
                    "Composition of Committees",
                    "Contact Information of Designated Officials – Investor Grievances",
                    "Newspaper Publications",
                    "Criteria of making payments to NEDs",
                    "Statements Dividend Distribution Policy",
                    "Contact Details of KMPs determining Materiality of Events",
                    "Secretarial Compliance Report",
                    "Credit Ratings",
                    "Investor Grievance Redressal",
                    "Familiarization Programme for Independent Directors",
                    "Policy on Related Party Transactions",
                    "Financial Information",
                    "Composition of BOD & Committees",
                    "Terms of Appointment of Independent Directors",
                    "Memorandum of Association and Articles of Association",
                    "Statement of deviation or variation under Reg 32 of SEBI LODR",
                    "Disclosure under Reg 30(8) of SEBI LODR",
                    "Annual Return",
                    "Subsidiaries – Financial Statements",
                    "Stock Exchange Intimations",
                    "Policy for determination of Materiality of Events",
                    "Schedule of Analysts/Investors Meet & Presentations",
                    "Shareholding Pattern",
                    "Policy for determination of Material Subsidiary",
                    "Whistle Blower Policy",
                    "Code of Conduct for BOD & SMP",
                    "Details of Business"
                ],
                required: false
            },
            extraLink: {
                type: String,
                required: false
            }
        }
    ]
},{
    timestamps:true
});


const DisclosuresModel = mongoose.model("Disclosures" , DisclosuresSchema);
module.exports = DisclosuresModel;
