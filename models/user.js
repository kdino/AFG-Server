const mongoose = require("mongoose");

// Schema Define
const userSchema = new mongoose.Schema({
  userid: { type: String, required: true, unique: true },
  gender: {type: Boolean, required: true},
  age: {type: Number, required: true}
});

// Create a new user document
userSchema.static.create = function(payload){
    const user = new this(payload);
    return user.save();
}

// Find one by userID
userSchema.static.findOneByTodoid = function (userid) {
  return this.findOne({ todoid });
};

// Create Model and Export
module.exports = mongoose.model("User", userSchema);
