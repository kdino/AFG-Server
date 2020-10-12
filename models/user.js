const mongoose = require("mongoose");

// Schema Define

const userSchema = new mongoose.Schema({
  uuid: {type: String, required: true, unique: true},
  gender: {type: String, required: true},
  dateOfBirth: {type: String, required: true},
  churchName: {type: String, require: true},
  thumbnailList: [{
    title: {type: String},
    photoBase64: {type: String} 
  }]
});

// Create a new user document
userSchema.statics.create = function(payload){
    const user = new this(payload);
    return user.save();
}

// Find one by userID
userSchema.statics.findOneByTodoid = function (uuid) {
  return this.findOne({ uuid });
};

userSchema.statics.updateOneById = function(uuid, thumbnail){
  console.log(uuid);
  console.log(thumbnail);
  return this.updateOne({ uuid : uuid }, {$push: {thumbnailList: thumbnail} });
};

// Create Model and Export
module.exports = mongoose.model("User", userSchema);
