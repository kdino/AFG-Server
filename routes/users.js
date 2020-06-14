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
router.get("/:userid", function (req, res) {
  User.findOneByTodoid(req.params.userid)
    .then((user) => {
      if (!user) return res.status(400).send({ "result": "fail" });
      res.status(200).send({ "result": "success" });
    })
    .catch((err) => res.status(500).send(err));
});

module.exports = router;
