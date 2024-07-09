const express = require("express");
const router = express.Router();

// Require controller modules.
const category_controller = require("../controllers/categoryController");
const item_controller = require("../controllers/itemController");

/// CATEGORY ROUTES ///

// GET catalog home page.
router.get("/", category_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get("/category/create", category_controller.category_create_get);

// POST request for creating species.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete species.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete species.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update species.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update species.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one species.
router.get("/categories", category_controller.category_list);

// GET request for one species.
router.get("/category/:id", category_controller.category_detail);


// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get("/item/create", item_controller.item_create_get);

// POST request for creating species.
router.post("/item/create", item_controller.item_create_post);

// GET request to delete species.
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request to delete species.
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request to update species.
router.get("/item/:id/update", item_controller.item_update_get);

// POST request to update species.
router.post("/item/:id/update", item_controller.item_update_post);

// GET request for one species.
router.get("/items", item_controller.item_list);

// GET request for one species.
router.get("/item/:id", item_controller.item_detail);
module.exports = router;
