// Add Express
const express = require("express");
const connectDb = require("./config/dbConnection")
const uploadRouter = require('./router.js')
var cors = require("cors");
const { createMember, getPhoto, getAttendeeData, verifyAttendee } = require("./controllers/member.js");

// Initialize Express
const dotenv = require("dotenv").config();
connectDb()
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(uploadRouter)

// const corsOptions = {
//     origin: [
//       'http://www.example.com',
//       'http://localhost:8080',
//     ],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   };
  
//   app.use(cors(corsOptions));

app.post("/enroll",  createMember);
app.get("/getPhoto",  getPhoto);
// app.get("/getAttendeeData",  getAttendeeData);
// app.put("/verifyAttendee",  verifyAttendee);

app.get("/", (req, res) => {
  res.send("Express on Vercel test AGAIN" + process.env.DRIVE_KEY);
});

// Initialize server
app.listen(3030, () => {
  console.log("Running on port 5000.");
});

module.exports = app;
