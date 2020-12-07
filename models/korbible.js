const mongoose = require("mongoose");

// Schema Define

const bibleSchema = new mongoose.Schema({
  book: { type: Number, required: true },
  chapter: { type: Number, required: true },
  verse: { type: Number, required: true },
  words: { type: String },
});

// Find one by userID
// bibleSchema.statics.findVerse = function (book, chapter, verse) {
//   return this.findOne({ book, chapter, verse });
// };

bibleSchema.statics.findVerse = function (book, chapter, verse1, verse2) {
	var returnObj;
	if (verse1 === verse2) {
	  returnObj = this.find({ book, chapter, verse: verse1 });
	} else {
	  returnObj = this.find({
		book,
		chapter,
		verse: { $gte: verse1, $lte: verse2 },
	  }).sort({ key: 1 });
	}
  
	return returnObj;
  };

// Create Model and Export
module.exports = mongoose.model("Korbible", bibleSchema);
