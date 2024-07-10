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
  const allCategories = await Category.find({}, "name items")
    .sort({ name: 1 })
    .populate("items")
    .exec();

  res.render("category_list", {
    title: "Category List",
    category_list: allCategories,
  });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  
  res.render("category_form", {
    title: "Create Category",
    errors: undefined,
    category: undefined,
  });
});

exports.category_create_post = [
  // Validate and sanitize the name field.
  body("name", "Category name must contain at least 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),

  body("desc", "Category description must contain at least 3 characters")
  .trim()
  .isLength({min:3})
  .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const category = new Category({ name: req.body.name, description:req.body.desc });

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


exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
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

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  await Category.findByIdAndDelete(req.body.categoryid);
  res.redirect("/catalog/categories");
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();
  res.render("category_form", {
    title: "Update Category",
    errors: undefined,
    category: category,
  });
});

exports.category_update_post = [
  // Validate and sanitize the name field.
  body("name", "Category name must contain at least 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("desc", "Category description must contain at least 3 characters")
    .trim()
    .isLength({min:3})
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
      const cateExists = await Category.findOne({ name: req.body.name, description: req.body.desc })
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

exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id)
    .populate("items")
    .exec(),
    Item.find({category:req.params.id},"name description").exec(),
  ]);

  if (category === null) {
    // No results.
    const err = new Error("category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", {
    title:"Category detail",
    items:items,
    category: category,
  });
});
