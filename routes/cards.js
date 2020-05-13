const router = require("express").Router();
const Card = require("../models/card");

// Create a new card Info
router.post("/", function (req, res) {
  Card.create(req.body)
    .then(function (card) {
      res.status(200).send(card);
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

module.exports = router;