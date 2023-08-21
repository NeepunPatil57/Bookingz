const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
app.use(express.json());

mongoose
  .connect(process.env.DB_KEY,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  res.json({ name, email, password });
});

app.listen(4000, () => {
  console.log("Server Running on Port 4000");
});
