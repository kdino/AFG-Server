const router = require("express").Router();
const Card = require("../models/card");
const User = require("../models/user");
const s3Api = require("../s3Api");

const upload = s3Api.upload.single("img");

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
          res.status(200).send({ result: "success" });
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

  Cards.findOneByTodoid(req.query.cardID)
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
