const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");
const data = require("./data.js");

main()
  .then((res) => {
    console.log("Connect To DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDb = async () => {
  await listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "653aa1097a5dab0e84def190",
  }));

  await listing.insertMany(initdata.data);
  console.log("data was initialized");
};
initDb();
