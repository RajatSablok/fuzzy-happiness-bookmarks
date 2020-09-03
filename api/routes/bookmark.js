const express = require("express");
const mongoose = require("mongoose");

const Tag = require("../models/tag");
const Bookmark = require("../models/Bookmark");

const router = express.Router();

//Create a bookmark
router.post("/", async (req, res) => {
  const { link, title, publisher, tags } = req.body;
  const now = Date.now();
  let flag = 1;
  await Bookmark.find()
    .exec()
    .then(async (bookmarks) => {
      for (i in bookmarks) {
        if (bookmarks[i].link == link) {
          flag = 0;
        }
      }
      if (flag == 0) {
        res.status(409).json({
          message: "Bookmark link already exists",
        });
      } else {
        const bookmark = new Bookmark({
          _id: new mongoose.Types.ObjectId(),
          title,
          link,
          publisher,
          tags,
          timeCreated: now,
        });
        await bookmark
          .save()
          .then(async (result) => {
            res.status(200).json({
              message: "Bookmark added",
              bookmark: result,
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

//Get all bookmarks
router.get("/all", async (req, res) => {
  await Bookmark.find()
    .exec()
    .then(async (bookmarks) => {
      res.status(200).json({
        message: "Bookmarks retrieved",
        count: bookmarks.length,
        bookmarks,
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
