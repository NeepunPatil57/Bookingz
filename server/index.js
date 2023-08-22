const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User.js");
const app = express();
require("dotenv").config();
app.use(express.json());

mongoose
  .connect(process.env.DB_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DataBase Connected"))
  .catch((err) => console.log(err));

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password,
    });

    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.get("/test", (req, res) => {
  res.json("Hello");
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });

    if (userDoc) {
      if (password === userDoc.password) {
        res.json("Password match");
      } else {
        res.status(422).json("Invalid password");
      }
    } else {
      res.json("User not found");
    }
  } catch (error) {
    res.status(500).json("Error occurred");
  }
});

app.listen(4000, () => {
  console.log("Server Running on Port 4000");
});
