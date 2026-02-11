const mongoose = require("mongoose");
const XLSX = require("xlsx");
const Distributor = require("./Model/distributorModel");

// 🔹 MongoDB Connection
mongoose
  .connect("mongodb+srv://keshukumar_db_user:9340179767@shyammetalics.w9eivc3.mongodb.net/?appName=ShyamMetalics")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));


// 🔹 Function to Convert to Proper Case
// Example: west bengal → West Bengal
function toProperCase(text) {
  if (!text) return "";

  return text
    .toLowerCase()
    .split(" ")
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}


// 🔹 Read Excel File
const workbook = XLSX.readFile("Active Distributor List.xlsx"); // your file name
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const data = XLSX.utils.sheet_to_json(sheet);


// 🔹 Import Function
const importData = async () => {
  try {

    const formattedData = data.map(row => ({
      state: toProperCase(row["STATE"]),
      district: toProperCase(row["District"]),
      name: toProperCase(row["DISTRIBUTOR Name"]),
      number: row["Contact Number"]?.toString().trim()
    }));

    await Distributor.insertMany(formattedData);

    console.log("✅ Data Imported Successfully");
    process.exit();

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

importData();
