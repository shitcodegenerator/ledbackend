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
    "type": "service_account",
    "project_id": "zakboxing",
    "private_key_id": "19bcf1488ba17a5dd639193a57a45f6be6a34738",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCsXWT9MZIpbVIr\nhCiVNBewaEsxw7Zrhs/67eGmPdz3iN/abr1ne+7OETJcswBKk3Rh4h6YzoWGLIev\nlV01vnOFrd4Qh2QiZ0/8TNOjKnGFLpBwHb5KuA4vOFRtxiJ+I0EIT+JvEW8VBih1\nNCG3ZfWBXhdWmkqJ9ERlIKiz4n41Zae3oUWlBwsCN1Dg5MOp6sXZONp2JjrwO5+l\nfYPLluEjPvqatGxfM9Em+vc9mnXvAUHClCJxsIZxTSYcWhsw6CUsbveew9j3+5H9\nrSjYUB+wbon6kz69ilb4187ohfLUIqEFtDr5HH7CUnskmr4JB8iK9UQJ7hqTqCFS\nvQQ6vtD1AgMBAAECggEAA0Xov4gb8u5xA4OIc8Df/EkWuHSzd5pBQ84VnV8KXab7\nPT4iGZ94WvBnqOv7Qu9G4/7zvsoZLgGVeAeZlAYwUmcJUv4HMEIO+kcJM82AB1vp\ngT+HWArjthDXRZhgGk4YE4zUy3Ak0FzkEsmxJDbq8RB01/+pD7KUQ+lZWsUfyWrD\nR8cOgCmCpuYULYI3PspEo2yeYXnWUe4SdCFMnFXYmVvwvYftq59e70O5QIgVV4Em\nZSS1IYgm+m2TxJAB19x6qPdRgaa5o/cF2t/ztN8Tgc93ldL+zTeo2cvqMtIykwZX\nysyYwvtr3eG9NaWmOVPsyuzaOWy6BqOVJyk8nzYLxwKBgQDYiohteg/zekof45qp\nobW4bJWyEQb/YK1qYsdavK2LLKSDPqnJVEd+B4LR7VBcRAq4m0uwSwQJWg4tEJYx\nLLIUkcSKD3OnHjMM7wJJ+ddVeE6PpR2g/6JmJquiHGJJ2wGk217MX+jupB+BEzSs\nd5a650h+25+CtiEunx9uAOBp/wKBgQDLxhKDX1CcpA+HQ8PuAowu6ircQ8DAzX6z\nhZ3WcKFaPaqX+D1nlVqseVRz1ym6TjEUWv8oj+/Ai6nmMfhJFErwhoLV28m02IP0\nQw8ilRRuStlxRjh+8fUXgKigqekokUPJbgiWsdkvyR5I4F34RWcnlsnYxMpVwj+2\nypMJoye9CwKBgBWXosj/3e1SaWfKo1Z86IjuUvMBnagDdOdh2C0lGU0Cc5keu4F2\n5PYdO59BQb0hj8weuCppIIrqLvWxbLiUk2FXs7hsmAS3DzIf9yN3RVChgXvzZAP0\n2bXD72Nn3yksLHrK4SYR/kElnnqZdqwn9KDIhUMZFUvMa3yho1mtvrLzAoGAQH/J\njFu3IF2trJr+gW+8/3yPZHjtohlpaVl5xE6SRAYQ4Vlp1keoE7+zw5bvVlE5p7/F\n1Aj7Um7isEJQ3JDXx5pL/3U6O0vtOHuhZsjZVq/Kc9hOOaBMe8v1lCUz7+tLEY8K\nmOhiXoXCWD7sf5E4PYe1DC/9+3cow6sLL5m9ElECgYBh64S3tKqvr9VWGloD8Kbw\nMgROxx6U7Mv3UyWXnfoy6MpWz7y+aQ5zXA/tNS6CGWIrxy5YDxzsvOxwVB+tjz4p\nlHGV7XWVzHkqQTjZhogYYvD8FRmNoiSe4UXWDpU87zLpKbzenfnhf5e/OZKxShnu\nzP24EzdC9J2aURRSdVJQxQ==\n-----END PRIVATE KEY-----\n",
    "client_email": "ledbackend@zakboxing.iam.gserviceaccount.com",
    "client_id": "102187801513047450786",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/ledbackend%40zakboxing.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
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
