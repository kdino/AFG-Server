//jshint esversion:6
const s3Api = require("./s3Api");
const config = require("./config.json");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const AWS = require("aws-sdk");

const s3 = new AWS.S3();
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.static("public"));

mongoose
  .connect(config.mongoDBstring, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(function () {
    console.log("Successfully connected to mongoDB");
  })
  .catch(function (err) {
    console.log(err);
  });
mongoose.set("useCreateIndex", true);

// users Router
app.use("/api/users", require("./routes/users"));

// cards Router
app.use("/api/cards", require("./routes/cards"));

// Get Default Image
app.get("/api/defaultPictures/:picID", function (req, res) {
  var params = {
    Bucket: config.defaultImageBucket,
    Key: req.params.picID,
    Expires: 10,
  };
  s3.getSignedUrl("getObject", params, function (err, url) {
    if (err) {
      res.status(403).send("Failed to get a image");
      console.log(err);
    } else {
      res.status(200).send(url);
      console.log(url);
    }
  });
});

// Post Custom Image
const upload = s3Api.upload.single("img");
app.post("/api/pictures", function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      res.status(500).send("{\"result\" : \"fail\"}");
    } else {
      res.status(200).send("{\"result\" : \"success\"}");
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
