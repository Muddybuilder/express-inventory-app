const Category = require("../models/category");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({}, "name categories")
    .sort({ name: 1 })
    .populate("categories")
    .exec();

  res.render("item_list", {
    title: "Item List",
    item_list: allItems,
  });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", {
    title: "Create Category",
    errors: undefined,
    category: undefined,
  });
});

exports.item_create_post = [
  // Validate and sanitize the name field.
  body("name", "Category name must contain at least 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),

  body("desc", "Category description must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const category = new Category({
      name: req.body.name,
      description: req.body.desc,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      const cateExists = await Category.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (cateExists) {
        // Category exists, redirect to its detail page.
        res.redirect(cateExists.url);
      } else {
        await category.save();
        // New Category saved. Redirect to Category detail page.
        res.redirect(category.url);
      }
    }
  }),
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ categories: req.params.id }).exec(),
  ]);
  if (category === null) {
    res.redirect("/catalog/categories");
  }

  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    items: items,
  });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Category.findByIdAndDelete(req.body.categoryid);
  res.redirect("/catalog/categories");
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();
  res.render("category_form", {
    title: "Update Category",
    errors: undefined,
    category: category,
  });
});

exports.item_update_post = [
  // Validate and sanitize the name field.
  body("name", "Category name must contain at least 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("desc", "Category description must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const category = new Category({
      name: req.body.name,
      description: req.body.desc,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Update Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const cateExists = await Category.findOne({
        name: req.body.name,
        description: req.body.desc,
      })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (cateExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(cateExists.url);
      } else {
        const updatedCate = await Category.findByIdAndUpdate(
          req.params.id,
          category,
          {}
        );
        // New genre saved. Redirect to genre detail page.
        res.redirect(updatedCate.url);
      }
    }
  }),
];

exports.item_detail = asyncHandler(async (req, res, next) => {
  const [categories, item] = await Promise.all([
    Category.find({ items: req.params.id }, "name description"),
    Item.findById(req.params.id).populate("categories").exec(),
  ]);

  if (item === null) {
    // No results.
    const err = new Error("items not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_detail", {
    title: "Item detail",
    item: item,
    categories: categories,
  });
});

// TODO: Finish item controller & views
