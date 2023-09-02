const express = require("express");
const multer = require("multer");
const path = require("path");
const { google } = require("googleapis");
const stream = require("stream");

const uploadRouter = express.Router();
const upload = multer();



const KEYFILEPATH = path.join(__dirname, "credentials.json");

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const uploadFile = async (fileObject) => {
    const bufferStream = new stream.PassThrough()
    bufferStream.end(fileObject.buffer)
    const { data } = await google.drive({
        version: 'v3', 
        auth
    }).files.create({
        media: {
            mimeType: fileObject.mimeType,
            body: bufferStream
        },
        requestBody: {
            name: fileObject.originalName,
            parents: ['1FoJbzJAPFISLePmWqaw3VIiBsJat1GBl'] //GoogleDrive Folder ID
        },
        fields: "id, name, thumbnailLink"
    })

    console.log(`SUCCESSFULLY UPLOADED: ${data.name} ${data.id}`)
    console.log(data.thumbnailLink)
}

uploadRouter.post('/upload', upload.any(), async (req,res) => {
    // console.log(req.body)
   try {
        // console.log(req.files)
        const { body, files } = req
        const targetFile = files[0]
        uploadFile(targetFile)
        res.status(200).send('SUBMITTED')
   } catch (err) {
    res.send(err.message)
   }
})

module.exports = uploadRouter
