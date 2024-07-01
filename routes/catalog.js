const express = require("express");
const router = express.Router();

// Require controller modules.
const category_controller = require("../controllers/categoryController");
const item_controller = require("../controllers/itemController");

/// SPECIES ROUTES ///

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
router.get("/category/:id", category_controller.category_detail);

module.exports = router;
