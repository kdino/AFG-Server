var s3API = {};

const AWS = require("aws-sdk");
AWS.config.region = "ap-northeast-2";

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
// const param = {
//     'Bucket': 'afgbucket',
//     'Key' : 'myImage',
//     'ACL' : 'public-read'
// }

var uploadParams = { Bucket: process.argv[2], Key: "", Body: "" };
var file = process.argv[3];

// Configure the file stream and obtain the upload parameters
const fs = require("fs");
var fileStream = fs.createReadStream(file);
fileStream.on("error", function (err) {
  console.log("File Error", err);
});
uploadParams.Body = fileStream;
const path = require("path");
uploadParams.Key = path.basename(file);

// call S3 to retrieve upload file to specified bucket
s3API.upload = function () {
  
  s3.upload(uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    }
    if (data) {
      console.log("Upload Success", data.Location);
    }
  });
};

module.exports = s3API;
