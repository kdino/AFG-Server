const mongoose = require("mongoose");

// Schema Define

const bibleSchema = new mongoose.Schema({
	book: { type: Number, required: true },
	chapter: { type: Number, required: true },
	verse: { type: Number, required: true },
	// verse2: { type: Number, required: true },
});

// Find one by userID
bibleSchema.statics.findVerse = function (book, chapter, verse) {
  return this.findOne({ book, chapter, verse });
};

// Create Model and Export
module.exports = mongoose.model("Korbible", bibleSchema);
