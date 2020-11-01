const mongoose = require("mongoose");

// Schema Define

const messageSchema = new mongoose.Schema({
	messageId: {type: Number, required: true, unique: true},
	message: {type: String, required: true}
});

// Create a new message document
messageSchema.statics.create = function(payload){
	const message = new this(payload);
	return message.save();
};

// Find one by messageId
messageSchema.statics.findOneByMessageId = function(messageId){
	return this.findOne({ messageId });
};

messageSchema.statics.updateOneByMessageId = function(messageId, message){
	return this.updateOne({ messageId: messageId }, { message: message });
};

module.exports = mongoose.model("Message", messageSchema);