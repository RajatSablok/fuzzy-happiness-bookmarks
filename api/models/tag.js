const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true, unique: true },
  timeCreated: { type: Number },
  timeUpdated: { type: Number },
});

module.exports = mongoose.model("Tag", tagSchema);
