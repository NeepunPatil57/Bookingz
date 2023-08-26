const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User.js");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser=require("cookie-parser");
const Imagedownloader = require('image-downloader');
const fs = require('fs');
const multer  = require('multer')
require("dotenv").config();



app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname+'/uploads'));
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
// console.log({__dirname});
app.post('/upload-by-link', async (req, res) => {
  try {
    const { link } = req.body;
    // console.log('link=',link);
    // console.log('here image uploader');
    const NewName = 'photo'+Date.now() + '.jpg';
    
    // Check if the link is provided before attempting to download the image
    if (!link) {
      return res.status(400).json({ error: "Missing link parameter" });
    }

    await Imagedownloader.image({
      url: link,
      dest: __dirname + '/uploads/' + NewName,
    });

    res.json(NewName);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "An error occurred while uploading the image" });
  }
});

const photosMiddleware = multer({ dest: 'uploads' });
app.post('/upload-from-device', photosMiddleware.array('photos', 100), (req, res) => {
  // console.log(req.files);
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace('uploads\\', ''));
  }
  console.log('Upload from Device');
  res.json(uploadedFiles);
});


app.listen(4000, () => {
  console.log("Server Running on Port 4000");
});
