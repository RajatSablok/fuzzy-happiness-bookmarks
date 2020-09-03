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
    .populate("tags", "title")
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

//Get all bookmarks
router.get("/all", async (req, res) => {
  await Bookmark.find()
    .select("-__v")
    .populate("tags", "title")
    .exec()
    .then(async (bookmarks) => {
      res.status(200).json({
        message: "Bookmarks retrieved",
        count: bookmarks.length,
        bookmarks,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
});

//Get a particular bookmark by id
router.get("/", async (req, res) => {
  const { bookmarkId } = req.query;
  await Bookmark.findById(bookmarkId)
    .select("-__v")
    .populate("tags", "title")
    .exec()
    .then(async (bookmark) => {
      res.status(200).json({
        message: "Bookmark retrieved",
        bookmark,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
});

//Add a tag to a bookmark
router.patch("/addTag", async (req, res) => {
  const { bookmarkId, tagId } = req.body;
  const now = Date.now();
  if (bookmarkId && tagId) {
    await Bookmark.updateOne(
      { _id: bookmarkId },
      { $push: { tags: tagId }, $set: { timeUpdated: now } }
    )
      .then(async (result) => {
        res.status(200).json({
          message: "Tag added to bookmark",
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Something went wrong",
          error: err.toString(),
        });
      });
  } else {
    res.status(400).json({
      message: "Data missing",
    });
  }
});

//Remove a tag to a bookmark
router.patch("/removeTag", async (req, res) => {
  const { bookmarkId, tagId } = req.body;
  const now = Date.now();
  await Bookmark.updateOne(
    { _id: bookmarkId },
    { $pull: { tags: tagId }, $set: { timeUpdated: now } }
  )
    .then(async (result) => {
      res.status(200).json({
        message: "Tag removed from bookmark",
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
});

//Delete a bookmark
router.delete("/", async (req, res) => {
  const { bookmarkId } = req.body;
  await Bookmark.deleteOne({ _id: bookmarkId })
    .then(
      res.status(200).json({
        message: "Bookmark deleted",
      })
    )
    .catch((err) => {
      res.status(400).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
});

module.exports = router;
