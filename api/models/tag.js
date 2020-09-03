const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String },
  timeCreated: { type: Number },
  timeUpdated: { type: Number },
});

module.exports = mongoose.model("Tag", tagSchema);
