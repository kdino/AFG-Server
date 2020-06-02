let AWS = require("aws-sdk");
AWS.config.loadFromPath(__dirname + '/config.json');
const config = require("./config.json")
let s3 = new AWS.S3();

let multer = require("multer");
let multerS3 = require('multer-s3');
var path = require('path');
var uuid = require('uuid/v4');

module.exports = {
    upload : multer({
        storage: multerS3({
            s3: s3,
            bucket: config.customImageBucket,
            key: function (req, file, cb) {
                let extension = path.extname(file.originalname);
                cb(null, uuid() + Date.now().toString() + extension)
            },
            acl: 'public-read-write'
        })
    })
};