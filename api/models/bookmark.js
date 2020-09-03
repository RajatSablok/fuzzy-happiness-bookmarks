const mongoose = require("mongoose");

const bookmarkSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  link: { type: String },
  title: { type: String },
  timeCreated: { type: Number },
  timeUpdated: { type: Number },
  publisher: { type: String },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectID,
      ref: "Tag",
    },
  ],
});

module.exports = mongoose.model("Bookmark", bookmarkSchema);
