const mongoose = require("mongoose");

// Schema Define
const cardSchema = new mongoose.Schema({
  uuid: {type: String, required: true},
  imgID: {type: String, required: true},
  book: { type: String, required: true },
  chapter: { type: Number, required: true },
  verse1: { type: Number, required: true },
  verse2: { type: Number, required: true },
  feelings: { type: [String], required: true },
  imageRatio: {type: Number, required: true},
  imgURI: { type: String}
});

// Create a new card
cardSchema.statics.create = function (payload) {
  const card = new this(payload);
  // console.log(payload);
  return card.save();
};

// Find one by userID
cardSchema.statics.findOneByTodoid = function (uuid, imgID) {
  return this.findOne({ uuid, imgID });
};

// Create Model and Export
module.exports = mongoose.model("Card", cardSchema);