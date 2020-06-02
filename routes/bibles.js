const router = require("express").Router();
const KorBible = require("../models/korbible");
const EngBible = require("../models/engbible");

// Find a word
// https://stackoverflow.com/questions/40967927/multiple-get-parameter-with-express?noredirect=1&lq=1

router.get("/kor", function (req, res) {
  KorBible.findVerse(req.query.book, req.query.chapter, req.query.verse)
    .then((words) => {
      if (!words) return res.status(400).send({ "result": "verse not found" });
      res.status(200).send(words);
    })
    .catch((err) => res.status(500).send(err));
});

router.get("/eng", function (req, res) {
  EngBible.findVerse(req.query.book, req.query.chapter, req.query.verse)
    .then((words) => {
      if (!words) return res.status(400).send({ "result": "verse not found" });
      res.status(200).send(words);
    })
    .catch((err) => res.status(500).send(err));
});


module.exports = router;
