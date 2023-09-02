const express = require("express");
const multer = require("multer");
const path = require("path");
const { google } = require("googleapis");
const stream = require("stream");

const uploadRouter = express.Router();
const upload = multer();

// const KEYFILEPATH = path.join(__dirname, "credentials.json");

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  //   keyFile: KEYFILEPATH,
  credentials: {
    type: "service_account",
    project_id: "zakboxing",
    private_key_id: "f3faa43d116ff04692f7a651be16f08d37e08e0f",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDyBNldZE65/+/z\nD2ud7ENYp7wEE7dUhmmJxrX6CixsaD4FyRdwMyiDRx0Lsp3wW8Ib87pKGAFKCsxL\nndzifMoca3eY32Sb2GdY6TPtOulGq3XE9jwm1hWfBJO/+9mBHUSMIHLdfvzgQG9A\nGqprRuUbKmJhxI0jUB2Se3XsNEfXrLzV4QbkvSAIg2wu76+dERRapSlGJdz/wB2s\nR22laqiDh/i2JFZs/ZMWvbj9vlh63+/Ru6U8wJ8RD59Nl+BuH4QWiOLy2Bi8B7HB\nPwtHkwaXx60Qq3fm3Q2d6J6j0//YQ+tllCl37KLOVsgERmMGoHnG46BTL05UoApS\nP/6pYXufAgMBAAECggEAQBSRmx1KjQwbs+8yzus2P7yV1zyDL7GxMwY2u8BC1+dX\n+L8wYghhozTKl4TRNcmN4UnM2v51JO4r/p+LUzq4ZwL7dTI9GNiZMJz6n0cYahpP\nAfoynhPUQLj9B/m+suWVd0bGMyiC+zuEWWRWGDZ6xhEYYIui1SVK1zSyWfrTxOJX\nfLYb5D8qquDHeXcVYaVh5I81JrG2lBz0ANmr3Cj1C9bezqFJyZYnmBwX6VCrqhbv\nja6IJ1NGtG7mtA4/UHMQmDE18tHOOJ1XSMmk4yLLtDDcQ/eOGrnMb6I2a3KtjFoO\nt6njp1cxZuj3i8jIyqTXPNjCc4bAWgUV9QF4hZAPnQKBgQD99fkQyMwAYl86dcmH\nIgyzU4wK3xV+/2xxdw2Guc6uiKKAI/X3n2/pQOputORa1aEdM6iF9QRb4sSQXf+l\nLp+Xe+bV7yAvdP7wp8OfbhpfYgJkMPqHcXEgE4snPXEMPmA3ANlCTZObRj/YOKJu\n3Db6RV3whTkpxg3/PZ18WDxamwKBgQDz9lRA7kI0+UKWYPhStRaL8d/jmzXKk/OS\nCgUKCsrSQsYYw/xOuV9K1lqLa4jQLFQ6IxBI4NANkrFPDX/iN/o9cjwqROSejhzi\n2jFylH+rqIKwzaLg8v/2shevL4xqKZp8Iyi/n8xKVrLiEG2tOjIeC5/TExVTLBDw\n2x8iSEjhTQKBgBUjdzLFc+2IQqLsEPU1iVcX2i1BelmSyyT6ot6W8rQmXVhLJfsR\ng1An/htu5R8Gbx2uIhXcWhuH2ZKmsFPAeLo0LveZqtUoaNwBKtBHatyLnOVYClJh\nx+fCmK+QdqttObb6VBsnt+SRyVinBiYyIEVepr4RaLuoZ5vaNhSWh5eHAoGBAJV5\nRaIK2THPzwaIH129ajUQW1b/D/QwtjmyPegrOJ2fH/Soj/xEA6i8sPlfR5IUtv5v\n4VhltdO7HzwKT2JxXbcsOMTFNTYYaIZtnYJQjfDE7F4bgEJHYKDr+Sry/RtGpkqM\n2DigVfDuMefknO5YC8Dw6lnPBW/SPgb0mpzMoSq5AoGBAKI56qbtDO8vlPyMQ+4t\n6Eb7KxdIEeczl07Vx2XOID8IW3xkAwxDxZVvFFe+FeZ9jzaX2ZcFMkqUPoCqTTl+\ngk5990Eun6i7f58HtxeTRZoSoTOz7hAZIk+Gu2Sqt7TYVNeo4wBjbkL3guK/LDM1\nR5FsqkrT6A1YnDasIgb/4OHA\n-----END PRIVATE KEY-----\n",
    client_email: "ledbackend@zakboxing.iam.gserviceaccount.com",
    client_id: "102187801513047450786",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/ledbackend%40zakboxing.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  },
  scopes: SCOPES,
});

const uploadFile = async (fileObject) => {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);
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
        name: fileObject.originalName,
        parents: ["1FoJbzJAPFISLePmWqaw3VIiBsJat1GBl"], //GoogleDrive Folder ID
      },
      fields: "id, name, thumbnailLink",
    });

  console.log(`SUCCESSFULLY UPLOADED: ${data.name} ${data.id}`);
  console.log(data.thumbnailLink);
};

uploadRouter.post("/upload", upload.any(), async (req, res) => {
  // console.log(req.body)
  try {
    // console.log(req.files)
    const { body, files } = req;
    const targetFile = files[0];
    uploadFile(targetFile);
    res.status(200).send("SUBMITTED");
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = uploadRouter;
