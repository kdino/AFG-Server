const mongoose = require("mongoose");

// Schema Define
const cardSchema = new mongoose.Schema({
  book: { type: String, required: true },
  chapter: { type: Number, required: true },
  verse1: { type: Number, required: true },
  verse2: { type: Number, required: true },
  feelings: { type: [String], required: true },
  image_id: { type: String, required: true },
});

// Create a new card
cardSchema.statics.create = function (payload) {
  const card = new this(payload);
  return card.save();
};

// Find one by userID
cardSchema.statics.findOneByTodoid = function (cardid) {
  return this.findOne({ cardid });
};

// Create Model and Export
module.exports = mongoose.model("Card", cardSchema);