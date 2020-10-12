const router = require("express").Router();
const Card = require("../models/card");
const User = require("../models/user");
const s3Api = require("../s3Api");
const sharp = require('sharp');
const request = require('request');

const upload = s3Api.upload.single("img");
const getBase64 = s3Api.getBase64.single("img");

var myReturn = {
  cardResult: "fail",
  pictureResult: "fail",
  message: null,
};

// Create a new card Info
router.post("/", function (req, res) {
  upload(req, res, function (err) {
    if (!err) myReturn.pictureResult = "success";

    Card.create(req.body)
      .then(function () {
        myReturn.cardResult = "success";
      })
      .catch(function (err) {
        myReturn.cardResult = "fail";
        myReturn.message = err;
      })
      .finally(function () {
        if (
          myReturn.cardResult == "success" &&
          myReturn.pictureResult == "success"
        ) {
            let options = {
              uri: "http://localhost:3000/api/users",
              method: 'PUT',
              body:{
                uuid : "myUUID",
                thumbnail : {
                  title : "titleExodus",
                  photoBase64 : "buf.toString('base64')"
                }
              },
              json:true
          };
          request(options, function(err,httpResponse,body){
            if(err) console.log(err);
            else console.log("req successed");
          });

          res.status(200).send({ result: "success" });
        } else {
          res.status(400).send({
            result: "fail",
            message: myReturn.message
          });
        }
      });
  });

  // getBase64(req, res, function(err){
  //   sharp(req.file.buffer).resize(150, 150).toBuffer(function(err, buf){
  //     if(err){
  //       console.log(err);
  //       res.send(err);
  //     }
  //     else{
  //       console.log(buf.toString('base64'));
        
  //       const p = {
  //         uuid : "myUUID",
  //         thumbnail : {
  //           title : "titleExodus",
  //           photoBase64 : buf.toString('base64')
  //         }
  //       };
  //       console.log(p.uuid);
  //       console.log(p.thumbnail);
  //       User.updateOneById(p.uuid, p.thumbnail);
  //     }
  //   });
  // });
});

router.get("/", function (req, res) {
  var returnData;
  var returnImg;
  var imgID;

  Card.findOneByTodoid(req.query.cardID)
    .then(function (card) {
      returnData = card;
      imgID = card.imgID;
    })
    .then(function(){
      returnImg = s3.getObject({Bucket: 'afgbucket', Key: imgID}).createReadStream();
    })
    .catch(function () {
      res.status(500).send({ result: "fail" });
      return;
    })
    .finally(function () {
      res.status(200).send({
        result: "success",
        img: returnImg,
        data: returnData
      });
    });
});

module.exports = router;
