#! /usr/bin/env node

console.log(
  'This script populates some test categories and items to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCate();
  await createItem();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, desc) {
  const category = new Category({ name: name, description: desc, items:[] });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function ItemCreate(index, category, name, desc) {
  const item = {
    category: category,
    name: name,
    description: desc,
  };

  const newItem = new Item(item);
  await newItem.save();
  items[index] = newItem;
  console.log(`Added items: ${newItem}`);
}

async function createCate() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Engine", "Engine parts"),
    categoryCreate(1, "AC", "AC system"),
    categoryCreate(2, "Wheels", "Various OEM & custom wheels"),
    categoryCreate(3, "Gaskets & Sealant", "Prevents leakage"),
  ]);
}

async function createItem() {
  console.log("Adding items");
  await Promise.all([
    ItemCreate(0, [], "Piston ring set", "4pcs ring set for piston"),
    ItemCreate(1, [], "Engine mount", "Front top engine mount"),
    ItemCreate(2, [], "134a refrigerant", "8oz can"),
    ItemCreate(3, [], "Custom aluminum wheel set", "4pcs wheels"),
  ]);
}
