const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");
const stream = require("stream");
const { Member } = require("./models/memberModel");

const uploadRouter = express.Router();
const upload = multer();

// const KEYFILEPATH = path.join(__dirname, "credentials.json");

const auth = new google.auth.GoogleAuth({
  credentials: {
    "type": "service_account",
    "project_id": "zakboxing",
    "private_key_id": "19bcf1488ba17a5dd639193a57a45f6be6a34738",
    "private_key": process.env.DRIVE_KEY,
    "client_email": "ledbackend@zakboxing.iam.gserviceaccount.com",
    "client_id": "102187801513047450786",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/ledbackend%40zakboxing.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  },
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const uploadFile = async (fileObject, mobile, fileId) => {

    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: "zakboxing",
        private_key_id: "19bcf1488ba17a5dd639193a57a45f6be6a34738",
        private_key: process.env.DRIVE_KEY.replace(/\\n/gm, "\n"),
        client_email: "ledbackend@zakboxing.iam.gserviceaccount.com",
        client_id: "102187801513047450786",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url:
          "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url:
          "https://www.googleapis.com/robot/v1/metadata/x509/ledbackend%40zakboxing.iam.gserviceaccount.com",
        universe_domain: "googleapis.com",
      },
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);

    if(fileId) {
      const { data } = await google
      .drive({
        version: "v3",
        auth,
      })
      .files.update({
        fileId,
        media: {
          mimeType: fileObject.mimeType,
          body: bufferStream,
        },
        fields: "id, name",
      });

    console.log(`SUCCESSFULLY UPDATED PHOTO`);

    return data;
    } else {
      const { data } = await google
      .drive({
        version: "v3",
        auth,
      })
      .files.create({
        media: {
          mimeType: fileObject.mimeType,
          body: bufferStream,
        },
        requestBody: {
          name: mobile,
          parents: ["1FoJbzJAPFISLePmWqaw3VIiBsJat1GBl"], //GoogleDrive Folder ID
        },
        name: mobile,
        fields: "id, name",
      });

    console.log(`SUCCESSFULLY UPLOADED: ${data.name} ${data.id}`);
    return data;
    }
   
  };
uploadRouter.post("/upload", upload.any(), async (req, res) => {
  try {
    const hasOne = await Member.findOne({ mobile: req.query.mobile });
    
    if (!hasOne) {
      res.status(400).json({ message: "此手機號碼尚未報名，請先報名活動", data: null });
      return
    }

    const { body, files } = req;
    const targetFile = files[0];
    const data = await uploadFile(targetFile, req.query.mobile, hasOne.photo_id);

    hasOne.photo_id = data.id
    hasOne.photo = `https://lh3.google.com/u/0/d/${data.id}`
    hasOne.doctor_name = req.query.doctor_name

    hasOne.save()

    res.status(200).json({ message: "Created", data: JSON.stringify(data) });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "伺服器錯誤，請聯繫活動主辦單位", data: null });
  }
});

module.exports = uploadRouter;
