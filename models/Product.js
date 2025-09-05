const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({ //schema of the product collection
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true }
});

module.exports = mongoose.model("Product", productSchema);


