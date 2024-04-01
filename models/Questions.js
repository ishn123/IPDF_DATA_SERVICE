const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema for Questions collection

const LabelSchema = new Schema({
  key: String,
  value: String
});

const QuestionSchema = new Schema({
    title: String,
    replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }], // Array of references to Replies collection
    user_id: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to Users collection
    votes: Number,
    postImg:String,
    labels: [{type:LabelSchema}],
    createdAt: { type: Date, default: Date.now }, // Set createdAt as default current date
    isUpvoted:Number,
    isDownvoted:Number,
    answer:String
  });

module.exports = mongoose.model("Questions",QuestionSchema);