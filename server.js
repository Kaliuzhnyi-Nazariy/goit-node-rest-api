// b2muGPpfa5Vg6EMF

const app = require("./app");

const mongoose = require("mongoose");

const DB_HOST =
  "mongodb+srv://Nazarii:b2muGPpfa5Vg6EMF@cluster0.5elfmem.mongodb.net/contacts_reader ";

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log("Database connection successful");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
