const express = require("express");
const mongoose = require("mongoose");

const Tag = require("../models/tag");
const Bookmark = require("../models/Bookmark");

const router = express.Router();

//Create a tag
router.post("/", async (req, res) => {
  const { title } = req.body;
  const now = Date.now();
  let flag = 1;
  await Tag.find()
    .exec()
    .then(async (tags) => {
      for (i in tags) {
        if (tags[i].title == title) {
          flag = 0;
        }
      }
      if (flag == 0) {
        res.status(409).json({
          message: "Tag title already exists",
        });
      } else {
        const tag = new Tag({
          _id: new mongoose.Types.ObjectId(),
          title,
          timeCreated: now,
        });
        await tag
          .save()
          .then(async (result) => {
            res.status(200).json({
              message: "Tag added",
              tag: result,
            });
          })
          .catch((err) => {
            res.status(400).json({
              message: "Something went wrong",
              error: err.toString(),
            });
          });
      }
    })
    .catch((err) => {
      res.status(400).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
});

//Delete a tag
router.delete("/", async (req, res) => {
  const { tagId } = req.body;
  await Bookmark.updateMany({ $pull: { tags: tagId } })
    .then(async (result) => {
      await Tag.deleteOne({ _id: req.params.id })
        .exec()
        .then(async (result) => {
          res.status(200).json({
            message: "Tag deleted",
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: "Something went wrong",
            error: err.toString(),
          });
        });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
});

//Get all tags
router.get("/all", async (req, res) => {
  await Tag.find()
    .select("-__v")
    .exec()
    .then(async (tags) => {
      res.status(200).json({
        message: "Tags retrieved",
        count: tags.length,
        tags,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
});

//Get a particular tag by id
router.get("/", async (req, res) => {
  const { tagId } = req.query;
  await Tag.findById(tagId)
    .select("-__v")
    .exec()
    .then(async (tag) => {
      res.status(200).json({
        message: "Tag retrieved",
        tag,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
});

module.exports = router;
