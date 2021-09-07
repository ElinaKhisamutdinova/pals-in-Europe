require("dotenv").config();
import mongoose from "mongoose";


const { DBURL } = process.env;
const options = {
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

async function dbconnect() {
  if (typeof DBURL === 'string') {
    await mongoose.connect(DBURL, options, (err) => {
      console.log("success connect mongo");
      if (err) return console.log(err);
    });
  }
}

export default dbconnect;
