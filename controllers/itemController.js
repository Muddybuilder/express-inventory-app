const Category = require("../models/category");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({}, "name categories")
    .sort({ name: 1 })
    .populate("category")
    .exec();

  res.render("item_list", {
    title: "Item List",
    item_list: allItems,
  });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  res.render("item_form", {
    title: "Create Item",
    errors: undefined,
    item: undefined,
  });
});

exports.item_create_post = [
  // Validate and sanitize the name field.
  body("name", "Item name must contain at least 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),

  body("desc", "Item description must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      description: req.body.desc,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("item_form", {
        title: "Create Item",
        item: item,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      const itemExists = await Item.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (itemExists) {
        // Category exists, redirect to its detail page.
        res.redirect(itemExists.url);
      } else {
        await item.save();
        // New Category saved. Redirect to Category detail page.
        res.redirect(item.url);
      }
    }
  }),
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();

  if (item === null) {
    res.redirect("/catalog/items");
  }

  res.render("item_delete", {
    title: "Delete Item",
    item: item,
  });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndDelete(req.body.itemid);
  res.redirect("/catalog/items");
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, category] = await Promise.all([
    Item.findById(req.params.id).populate("category").exec(),
    Category.find({ items: req.params.id }, "name description"),
  ]);
  res.render("item_form", {
    title: "Update Item",
    errors: undefined,
    item: item,
    category: category,
  });
});

exports.item_update_post = [
  // Validate and sanitize the name field.
  body("name", "Item name must contain at least 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("desc", "Item description must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // TODO: Make item can have multiple categories
    const category = await Category.find({name:req.body.cate}).exec();
    console.log(category)

    if(!category){
      category = new Category({name:req.body.cate, description:""})
    }

    // Create a genre object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      description: req.body.desc,
      category: category,
      _id: req.params.id,
    });



    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("item_form", {
        title: "Update Item",
        item: item,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
      console.log(updatedItem);
      // New item saved. Redirect to item detail page.
      res.redirect(updatedItem.url);
    }
  }),
];

exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();

  if (item === null) {
    // No results.
    const err = new Error("items not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_detail", {
    title: "Item detail",
    item: item,
  });
});
