const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

dotenv.config();
app.use(express.json())

const pinRoute = require("./routes/pins")
const userRoute = require("./routes/users")


mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MONGO DB");
  })
  .catch((err) => console.log(err));

app.use("/api/pins", pinRoute);
app.use("/api/user",userRoute);
app.listen(7000, () => {
  console.log("backend server running");
});
