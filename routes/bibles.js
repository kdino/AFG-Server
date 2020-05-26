const router = require("express").Router();
const User = require("../models/bible");

// Find a word
// https://stackoverflow.com/questions/40967927/multiple-get-parameter-with-express?noredirect=1&lq=1

router.get("/:userid", function (req, res) {
  User.findOneByTodoid(req.params.userid)
    .then((user) => {
      if (!user) return res.status(404).send({ "result": "User not found" });
      res.status(200).send(user);
    })
    .catch((err) => res.status(500).send(err));
});

module.exports = router;
