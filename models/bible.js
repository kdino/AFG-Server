const mongoose = require("mongoose");

// Schema Define

const bibleSchema = new mongoose.Schema({
  gender: {type: String, required: true},
  age: {type: Number, required: true},
  churchName: {type: String, require: true},
  religiousSect: {type: String, require: true}
});

// Find one by userID
bibleSchema.statics.findOneByTodoid = function (_id) {
  return this.findOne({ _id });
};

// Create Model and Export
module.exports = mongoose.model("Bible", bibleSchema);
