const router = require("express").Router();
const BibleNIV = require("../models/bibleNIV");
const BibleNKJV = require("../models/bibleNKJV");
const BibleRevision = require("../models/bibleRevision");
const BibleStandard = require("../models/bibleStandard");

// Find a word
// https://stackoverflow.com/questions/40967927/multiple-get-parameter-with-express?noredirect=1&lq=1

router.get("/niv", function (req, res) {
  BibleNIV.findVerse(
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

router.get("/nkjv", function (req, res) {
  BibleNKJV.findVerse(
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

router.get("/revision", function (req, res) {
  BibleRevision.findVerse(
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

router.get("/standard", function (req, res) {
  BibleStandard.findVerse(
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

module.exports = router;
