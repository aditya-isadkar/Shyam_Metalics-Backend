const mongoose = require("mongoose");
const XLSX = require("xlsx");
const Distributor = require("./Model/bussinessdirectory");

// Connect MongoDB
mongoose
  .connect("mongodb+srv://keshukumar_db_user:9340179767@shyammetalics.w9eivc3.mongodb.net/?appName=ShyamMetalics")
  .then(() => console.log("MongoDB Connected"))
  .catch(console.error);

const FILE_PATH = "D:/Webisdom/ShyamMetalics/Shyam_Metalics-Backend/Dealer Distributor Locator.xlsx";


// Helper function
const normalize = (text = "") =>
  text.toString().toLowerCase().replace(/[^a-z]/g, "");

const importExcel = async () => {
  try {
    const workbook = XLSX.readFile(FILE_PATH);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert to 2D array
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const headers = rows[0];

    // 🔎 Auto detect columns
    const columnMap = {
      customerName: headers.findIndex(h =>
        normalize(h).includes("customername")
      ),
      contactNumber: headers.findIndex(h =>
        normalize(h).includes("contactnumber")
      ),
      district: headers.findIndex(h =>
        normalize(h).includes("district")
      ),
      state: headers.findIndex(h =>
        normalize(h).includes("state")
      ),
    };

    console.log("Detected Columns:", columnMap);

    if (Object.values(columnMap).includes(-1)) {
      console.log("❌ Some columns not detected. Check header row.");
      return;
    }

    let success = 0;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

      const customerName = row[columnMap.customerName];
      const contactNumber = row[columnMap.contactNumber];
      const district = row[columnMap.district];
      const state = row[columnMap.state];

      if (!customerName || !contactNumber || !district || !state) {
        console.log("⚠ Skipped Row:", row);
        continue;
      }

      await Distributor.create({
        customerName: String(customerName).trim(),
        contactNumber: String(contactNumber).trim(),
        district: String(district).trim(),
        state: String(state).trim(),
      });

      success++;
    }

    console.log(`✅ Imported ${success} records`);
    mongoose.connection.close();

  } catch (err) {
    console.error("Import Error:", err);
  }
};

importExcel();
