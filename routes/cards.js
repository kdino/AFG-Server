const router = require("express").Router();
const Card = require("../models/card");
const User = require("../models/user");
const s3Api = require("../s3Api");
const sharp = require('sharp');
const request = require('request');
const axios = require('axios');

const upload = s3Api.upload.single("img");
const getBase64 = s3Api.getBase64.single("img");

var myReturn = {
  cardResult: "fail",
  pictureResult: "fail",
  message: null,
};

var baseString = 'none';

// Create a new card Info
router.post("/", function (req, res) {
  upload(req, res, function (err) {
    if (!err) myReturn.pictureResult = "success";

    console.log(req.body);
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
            // axios.get(req.file.location, {
            //   responseType: 'arraybuffer'
            // }).then(function(response){
            //   const buff = Buffer.from(response.data, 'binary').toString();
            //   // var baseString = buf.toString('base64');
            //   console.log(buff);
            //   sharp(buff.toString()).resize(150, 150).toBuffer(function(err, buf){
            //     if(err){
            //       console.log(err);
            //       res.send(err);
            //     }
            //     else{
            //       baseString = buf.toString('base64');
            //     }
            //   });
            // });

            axios.get(req.file.location, { responseType: 'arraybuffer' })
              .then((res) => {
                console.log(`Resizing Image!`);
                return sharp(res.data)
                  .resize(150, 150)
                  .toBuffer(function(err, buf){
                    if(err){
                      console.log(err);
                      res.send(err);
                    }
                    else{
                      baseString = buf.toString('base64');
                      console.log(baseString);
                      var options = {
                        uri: "http://localhost:3000/api/users",
                        method: 'PUT',
                        body:{
                          uuid : req.body.uuid,
                          thumbnail : {
                            title : req.body.book + " " + req.body.chapter + " " + req.body.verse1,
                            photoBase64 : baseString,
                            imgID : req.body.imgID
                          }
                        },
                        json:true
                      };
                      // console.log(options.body);
                      request(options, function(err,httpResponse,body){
                        if(err) console.log(err);
                        else{
                          console.log("req successed");
                        }
                      });
                    }
                  });
              })
              .then(() => {
                res.status(200).send({ result: "success" });
              })
              .catch((err) => {
                console.log(`Couldn't process: ${err}`);
              });

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

  Card.findOneByTodoid(req.query.uuid, req.query.imgID)
    .then(function (card) {
      console.log(card);
      returnData = card;
      imgID = card.imgID;
    })
    .catch(function () {
      res.status(500).send({ result: "fail" });
      return;
    })
    .finally(function () {
      res.status(200).send({
        result: "success",
        data: returnData,
        imgURL: "https://afgbucket.s3.ap-northeast-2.amazonaws.com/" + returnData.imgID + ".jpg",
      });
    });
});

module.exports = router;
