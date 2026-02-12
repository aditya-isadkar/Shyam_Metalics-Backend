require("dotenv").config();
const mongoose = require("mongoose");

/* ==============================
   🔹 CONFIGURATION
================================= */

// 👉 Replace with your MongoDB connection string
const MONGO_URI =
  process.env.MONGO_URI || "mongodb+srv://keshukumar_db_user:9340179767@shyammetalics.w9eivc3.mongodb.net/?appName=ShyamMetalics";

// 👉 Replace with your actual collection name
const COLLECTION_NAME = "investoranalysts";

/* ==============================
   🔹 MAIN FUNCTION
================================= */

async function deleteInvestorDocuments() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGO_URI);

    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection(COLLECTION_NAME);

    console.log("Deleting matching documents...");

    const result = await collection.updateMany(
      {},
      {
        $pull: {
          investor_analyst_details: {
            titlename: {
              $in: [
                "Investor Presentation",
                "Transcript",
                "Investor Call Intimation",
                "Investor Call Recording",
              ],
            },
          },
        },
      }
    );

    console.log("✅ Deletion Completed!");
    console.log("Modified Documents:", result.modifiedCount);

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit();
  }
}

/* ==============================
   🔹 RUN SCRIPT
================================= */

deleteInvestorDocuments();
