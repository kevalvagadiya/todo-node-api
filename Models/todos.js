const mongoose = require("mongoose");

const Todo = mongoose.Schema({
  value: String,
  isCompleted: Boolean,
  key: Number,
});

const collectionName = "Todo";

module.exports = mongoose.model("Todo", Todo, collectionName);
