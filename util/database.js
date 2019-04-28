const mongoose = require("mongoose");

// this is our MongoDB database
const dbRoute = "mongodb://localhost:27017/pungellerpenis";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

module.exports = function () {
  return new Promise((res, rej) => {
    let db = mongoose.connection;
    
    db.once("open",u => {
      console.log("connected to the database")
      return res(db)
    });
    
    // checks if connection with the database is successful
    db.on("error", e => {
      console.error("MongoDB connection error:")
      return rej(e)
    });
  })
}