const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
    text: String,
    vote: Number,
    createdAt: { type: Date, default: Date.now },
    isUpvoted: Number,
    isDownvoted: Number,
    user_id: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to Users collection
  });


module.exports = mongoose.model("Reply",ReplySchema);
  
  