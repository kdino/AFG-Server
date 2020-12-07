const router = require("express").Router();
const User = require("../models/user");

// Create a new user document
router.post("/", function (req, res) {
  User.create(req.body)
    .then(function (user) {
      res.status(200).send({ "result": "success" });
    })
    .catch(function (err) {
      if (err.code == 11000) {
        res.status(400).send({ "result": "fail" });
      }
      else {
        res.status(500).send(err);
      }
    });
});

// Find one by userID
router.get("/", function (req, res) {
  User.findOneByTodoid(req.query.uuid)
    .then((user) => {
      if (!user) return res.status(400).send({ "result": "fail" });
      res.status(200).send({
          result: "success",
          thumbnailList: user.thumbnailList
        });
      console.log(user);
    })
    .catch((err) => res.status(500).send(err));
});

// Append thumbnail
  router.put("/", function (req, res){
    User.updateOneById(req.body.uuid, req.body.thumbnail)
    .then(function (user) {
      res.status(200).send({ "result": "success" });
    })
    .catch(function (err) {
      if (err.code == 11000) {
        res.status(400).send({ "result": "fail" });
      }
      else {
        res.status(500).send(err);
      }
    });
  });

  router.delete("/", function (req, res){
    User.deleteThumbnail(req.query.uuid, req.query.imgID)
    .then(function(){
      res.status(200).send({ "result": "success" });
    })
    .catch(function(err){
      res.status(400).send({ "result": "fail" });
    });
  });

module.exports = router;
