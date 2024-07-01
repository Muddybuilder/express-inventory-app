const Category = require("../models/category");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const [numCat, numItems] = await Promise.all([
    Category.countDocuments({}).exec(),
    Item.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Treat Yo' Car",
    category_count: numCat,
    item_count: numItems,
  });
});

exports.category_list = asyncHandler(async (req, res, next) => {
  res.send("Not Implemented yet!");
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.send("Not Implemented yet!");
});

exports.category_create_post = asyncHandler(async (req, res, next) => {
  res.send("Not Implemented yet!");
});

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send("Not Implemented yet!");
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send("Not Implemented yet!");
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("Not Implemented yet!");
});

exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("Not Implemented yet!");
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  res.send("Not Implemented yet!");
});
