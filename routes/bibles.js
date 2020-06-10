const router = require("express").Router();
const KorBible = require("../models/korbible");
const EngBible = require("../models/engbible");

// Find a word
// https://stackoverflow.com/questions/40967927/multiple-get-parameter-with-express?noredirect=1&lq=1

router.get("/kor", function (req, res) {
  KorBible.findVerse(
    req.query.book,
    req.query.chapter,
    req.query.verse1,
    req.query.verse2
  )
    .then((returnObj) => {
      if (!returnObj)
        return res.status(400).send({ result: "verse not found" });
      var returnVerse = "";
      Array.prototype.forEach.call(returnObj, (element) => {
        returnVerse += element.words + " ";
      });
      res.status(200).send({
        result: "success",
        words: returnVerse.substring(0, returnVerse.length - 1),
      });
    })
    .catch((err) => res.status(500).send(err));
});

router.get("/eng", function (req, res) {
  EngBible.findVerse(
    req.query.book,
    req.query.chapter,
    req.query.verse1,
    req.query.verse2
  )
    .then((returnObj) => {
      if (!returnObj)
        return res.status(400).send({ result: "verse not found" });
      var returnVerse = "";
      Array.prototype.forEach.call(returnObj, (element) => {
        returnVerse += element.words + " ";
      });
      res
        .status(200)
        .send({
          result: "success",
          words: returnVerse.substring(0, returnVerse.length - 1),
        });
    })
    .catch((err) => res.status(500).send(err));
});

module.exports = router;
