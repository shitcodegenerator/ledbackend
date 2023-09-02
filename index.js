// Add Express
const express = require("express");
const uploadRouter = require('./router.js')
var cors = require("cors");

// const multer = require("multer");
// const { google } = require("googleapis");
// const stream = require("stream");

// const upload = multer();

// Initialize Express
const dotenv = require("dotenv").config();
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

// app.post("/upload", upload.any(), async (req, res) => {
//   // console.log(req.body)
//   try {
//     const uploadFile = async (fileObject) => {
//       const auth = new google.auth.GoogleAuth({
//         credentials: {
//           type: "service_account",
//           project_id: "zakboxing",
//           private_key_id: "19bcf1488ba17a5dd639193a57a45f6be6a34738",
//           private_key: process.env.DRIVE_KEY.replace(/\\n/gm, "\n"),
//           client_email: "ledbackend@zakboxing.iam.gserviceaccount.com",
//           client_id: "102187801513047450786",
//           auth_uri: "https://accounts.google.com/o/oauth2/auth",
//           token_uri: "https://oauth2.googleapis.com/token",
//           auth_provider_x509_cert_url:
//             "https://www.googleapis.com/oauth2/v1/certs",
//           client_x509_cert_url:
//             "https://www.googleapis.com/robot/v1/metadata/x509/ledbackend%40zakboxing.iam.gserviceaccount.com",
//           universe_domain: "googleapis.com",
//         },
//         scopes: ["https://www.googleapis.com/auth/drive"],
//       });

//       const bufferStream = new stream.PassThrough();
//       bufferStream.end(fileObject.buffer);
//       const { data } = await google
//         .drive({
//           version: "v3",
//           auth,
//         })
//         .files.create({
//           media: {
//             mimeType: fileObject.mimeType,
//             body: bufferStream,
//           },
//           requestBody: {
//             name: fileObject.originalName,
//             parents: ["1FoJbzJAPFISLePmWqaw3VIiBsJat1GBl"], //GoogleDrive Folder ID
//           },
//           fields: "id, name, thumbnailLink",
//         });

//       console.log(`SUCCESSFULLY UPLOADED: ${data.name} ${data.id}`);
//       console.log(data.thumbnailLink);
//       return data;
//     };
//     // console.log(req.files)
//     const { body, files } = req;
//     console.log(req.body);
//     const targetFile = files[0];
//     const data = await uploadFile(targetFile);
//     res.status(200).send("SUBMITTED" + JSON.stringify(data));
//   } catch (err) {
//     res.status(400).send(`${err?.message}, ${JSON.stringify(req)}`);
//   }
// });

app.get("/", (req, res) => {
  // res.sendFile(__dirname + '/index.html')
  res.send("Express on Vercel test AGAIN" + process.env.DRIVE_KEY);
});

// Initialize server
app.listen(3030, () => {
  console.log("Running on port 5000.");
});

module.exports = app;
