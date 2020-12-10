const router = require("express").Router();
const Card = require("../models/card");
const User = require("../models/user");
const s3Api = require("../s3Api");
const sharp = require('sharp');
const request = require('request');
const axios = require('axios');
const config = require("../config.json");

const upload = s3Api.upload.single("img");

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

//    console.log(req.body);
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
                      var mytitle;
                      if (req.body.verse1 == req.body.verse2){
                        mytitle = req.body.book + " " + req.body.chapter + ":" + req.body.verse1;
                      }
                      else{
                        mytitle = req.body.book + " " + req.body.chapter + ":" + req.body.verse1 + "-" + req.body.verse2;
                      }

                      var options = {
                        uri: "http://localhost:3000/api/users",
                        method: 'DELETE',
                        qs:{
                          uuid : req.body.uuid,
                          imgID : req.body.imgID
                        }
                      };
                
                      request(options, function(err,httpResponse,body){
                        if(err) console.log(err);
                        else{
                          console.log("req successed");
                        }
                      });

                      options = {
                        uri: "http://localhost:3000/api/users",
                        method: 'PUT',
                        body:{
                          uuid : req.body.uuid,
                          thumbnail : {
                            title : mytitle,
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
        imgURL: config.bucketURL + returnData.imgID + ".jpg",
      });
    });
});

router.delete("/", function(req, res){
  Card.deleteCard(req.query.uuid, req.query.imgID)
    .then(function (card) {
      console.log(card);

      var options = {
        uri: "http://localhost:3000/api/users",
        method: 'DELETE',
        qs:{
          uuid : req.query.uuid,
          imgID : req.query.imgID
        }
      };

      request(options, function(err,httpResponse,body){
        if(err) console.log(err);
        else{
          console.log("req successed");
        }
      });
    })
    .catch(function (){
      res.status(500).send({ result: "fail" });
      return;
    })
    .finally(function (){
      res.status(200).send({
        result: "success"
      });
    });
});

module.exports = router;
