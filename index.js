// Add Express
const express = require("express");
// const uploadRouter = require('./router.js')

// Initialize Express
const dotenv = require("dotenv").config()
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(uploadRouter)

// Create GET request
// app.get("/", (req, res) => {
//   res.send("Express on Vercel");
// });

app.get("/", (req, res) => {
    // res.sendFile(__dirname + '/index.html')
      res.send("Express on Vercel test AGAIN");
});

// Initialize server
app.listen(3030, () => {
  console.log("Running on port 5000.");
});

module.exports = app;