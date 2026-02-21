const mongoose = require("mongoose");
const DisclosuresSchema = new mongoose.Schema({
    detail: [
        {
            name: {
                type: String,
                required: false
            },
            date: {
                type: String,
                required: false
            },
            file: {
                type: String,
                required: false
            },
            mainTitle: {
                type: String,
                enum: [
                    "Details of Business",
                    "Memorandum of Association and Articles of Association",
                    "Brief Profile of Board of Directors including Directorship and Full-time Positions in Body Corporates",
                    "Terms and conditions of appointment of independent directors",
                    "Composition of various committees of board of directors",
                    "Code of conduct of board of directors and senior management personnel",
                    "Details of establishment of vigil mechanism/Whistle Blower policy",
                    "Policy on dealing with related party transactions",
                    "Policy for determining ‘material’ subsidiaries",
                    "Details of familiarization programmes imparted to directors",
                    "Email address for grievance redressal and other relevant details",
                    "Contact information of the designated officials responsible for assisting and handling investor grievances",
                    "Notice of meeting of the Board of Directors where financial results shall be discussed",
                    "Financial results approved at the Board Meeting",
                    "Complete copy of the Annual Report including Balance Sheet, Profit and Loss Account, Directors’ Report, Corporate Governance Report, etc.",
                    "Shareholding pattern",
                    "Schedule of analyst or institutional investor meet",
                    "Presentations made to analysts or institutional investors",
                    "Audio or video recordings of post-earnings/quarterly calls",
                    "Transcripts of post-earnings/quarterly calls",
                    "Items under sub-regulation (1) of Regulation 47",
                    "All credit ratings obtained for outstanding instruments",
                    "Separate audited financial statements of each subsidiary of the listed entity in respect of a relevant financial year",
                    "Secretarial Compliance Report",
                    "Policy for determination of materiality of events/information",
                    "Contact details of Key Managerial Personnel authorized for determining materiality of events/information",
                    "Dividend Distribution Policy",
                    "Annual Return",
                    "Disclosure required under Regulation 30(8)",
                    "Other",
                    ""
                ],
                required: false
            },
            sequenceNumber: {
                type: Number,
                required: false
            },
            manualTitle: {
                type: String,
                required: false
            },
            extraLink: {
                type: String,
                required: false
            }
        }
    ]
}, {
    timestamps: true
});


const DisclosuresModel = mongoose.model("Disclosures", DisclosuresSchema);
module.exports = DisclosuresModel;
