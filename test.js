const mongoose = require("mongoose");
const InvestorAnalyst = require("./Model/InvestorAnlystModel");

(async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://keshukumar_db_user:9340179767@shyammetalics.w9eivc3.mongodb.net/?appName=ShyamMetalics"
    );

    const docs = await InvestorAnalyst.find({
      "investor_analyst_details._id": { $exists: false }
    });

    for (const doc of docs) {
      let changed = false;

      doc.investor_analyst_details.forEach(item => {
        if (!item._id) {
          item._id = new mongoose.Types.ObjectId();
          changed = true;
        }
      });

      if (changed) {
        await doc.save({ validateBeforeSave: false });
        console.log("Updated:", doc._id.toString());
      }
    }

    console.log("Migration completed ✅");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed ❌", err);
    process.exit(1);
  }
})();
