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
            res.status(500).json({
              message: "Something went wrong",
              error: err.toString(),
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
});

//Delete a tag
router.delete("/:id", async (req, res) => {
  await Tag.deleteOne({ _id: req.params.id })
    .exec()
    .then(async (result) => {
      res.status(200).json({
        message: "Todo item deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
});

//Get all tags
router.get("/all", async (req, res) => {
  await Tag.find()
    .exec()
    .then(async (tags) => {
      res.status(200).json({
        message: "Tags retrieved",
        count: tags.length,
        tags,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
});

module.exports = router;
