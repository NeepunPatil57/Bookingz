const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User.js");
const Place = require("./models/Place.js");
const Booking=require("./models/Booking.js");
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

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtsecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

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

app.get("/places", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtsecret, {}, async (err, user) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { id } = user;
    try {
      const places = await Place.find({ owner: id });
      res.json(places);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

app.get("/places/:id",async(req, res) => {
  const{id} = req.params;
  res.json(await Place.findById(id));
});

app.put("/places",async(req, res) => {
  const { token } = req.cookies;
  const {
    id,title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests,price
  } = req.body;
  jwt.verify(token, jwtsecret, {}, async (err, user) => {
    if(err) throw err;
    const placeDoc=await Place.findById(id);
    if(user.id===placeDoc.owner.toString()){
      placeDoc.set({
        title,
        address,
        photos:addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json("Ok");
    }
  });
});


app.post("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests,price,
  } = req.body;
  
  console.log("data", { checkIn, maxGuests }); // Make sure values are printed correctly

  jwt.verify(token, jwtsecret, {}, async (err, user) => {
    if (err) {
      throw err;
    }
    try {
      const placeDoc = await Place.create({
        owner: user.id,
        title,
        address,
        photos:addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });

      // Send a single response with the created place document and a status code
      res.status(201).json({ message: "Place created successfully", place: placeDoc });
    } catch (error) {
      // Handle any errors that occurred during the creation process
      console.error(error); // Print the error for debugging
      res.status(500).json({ error: "An error occurred while creating the place" });
    }
  });
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

app.get('/all-places',async(req,res)=>{
  res.json(await Place.find())
});

app.post('/bookings',async(req,res)=>{
  console.log('Booking');
  const userData=await getUserDataFromReq(req);
  const{place,checkIn,checkOut,numberofGuests,name,phone,price,}=req.body;
  Booking.create({
    place,
    checkIn,
    checkOut,
    numberofGuests,
    name,
    phone,
    price,
    user:userData.id,
  }).then((doc)=>{
    res.json(doc);
  }).catch((err)=>{
    throw err;
  });
});

app.get('/bookings', async (req, res) => {
  const userData=await getUserDataFromReq(req);
  res.json( await Booking.find({user:userData.id}).populate('place'));
});


app.listen(4000, () => {
  console.log("Server Running on Port 4000");
});
