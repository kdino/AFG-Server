const router = require("express").Router();
const Card = require("../models/card");
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

module.exports = router;
