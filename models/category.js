const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type:String,
        required:true,
    },

    description:{
        type:String,
        required:true
    },
    items:[{type:Schema.Types.ObjectId, ref:"Item"}]

});

CategorySchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/category/${this._id}`;
});

module.exports = mongoose.model("Category", CategorySchema);
