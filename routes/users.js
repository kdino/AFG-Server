const router = require("express").Router();
const User = require("../models/user");

// Create a new user document
router.post("/", function (req, res) {
  User.create(req.body)
    .then(function (user) {
      res.send(todo);
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

// Find one by userID
router.get("/:userid", function (req, res) {
  User.findOneByTodoid(req.params.userid)
    .then((user) => {
      if (!user) return res.status(404).send({ err: "User not found" });
      res.send(`findOne successfully: ${user}`);
    })
    .catch((err) => res.status(500).send(err));
});

module.exports = router;
