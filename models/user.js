const mongoose = require("mongoose");

// Schema Define

const userSchema = new mongoose.Schema({
  gender: {type: String, required: true},
  age: {type: Number, required: true},
  churchName: {type: String, require: true},
  religiousSect: {type: String, require: true}
});

// Create a new user document
userSchema.statics.create = function(payload){
    const user = new this(payload);
    return user.save();
}

// Find one by userID
userSchema.statics.findOneByTodoid = function (_id) {
  return this.findOne({ _id });
};

// Create Model and Export
module.exports = mongoose.model("User", userSchema);
