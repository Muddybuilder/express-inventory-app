const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: {
        type:String,
        required:true,
    },

    description:{
        type:String,
        required:true
    },
    categories:[{type:Schema.Types.ObjectId, ref:"Category"}]

});

ItemSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
