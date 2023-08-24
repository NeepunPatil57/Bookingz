const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User.js");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser=require("cookie-parser");
require("dotenv").config();



app.use(express.json());
app.use(cookieParser());
const jwtsecret='salting';

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

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtsecret, {}, (err, user) => {
      if (err) {
        throw err;
      }
      res.json(user);
    });
  } else {
    res.json(null);
  }
});

app.post("/logout",(req,res)=>{
  res.cookie('token','').json(true);
});


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });

    if (userDoc) {
      if (password===userDoc.password){
        jwt.sign({email: userDoc.email,id:userDoc._id,name:userDoc.name},jwtsecret,{},(err,token)=>{
          if(err){
            throw err;
          }
          res.cookie('token',token).json(userDoc);
        });
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
