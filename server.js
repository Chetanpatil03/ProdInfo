const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");

const app = express();
app.use(express.json());
app.use(express.static("public")); // serve frontend

// ✅ Connect to MongoDB
mongoose.connect("mongodb+srv://chetan_03:Chetan@2003@cluster0.xv72skq.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.log(err));

// ➕ Add Product
app.post("/add", async (req, res) => {
  try {
    const { name, price, stock } = req.body; // ✅ only 3 fields
    const product = new Product({ name, price, stock });
    await product.save();
    res.status(201).send(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 📖 Get All Products
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// 📖 Get One Product
app.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

// ✏️ Update Product
app.put("/update/:id", async (req, res) => {
  try {
    const { name, price, stock } = req.body; // ✅ only 3 fields
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, stock },
      { new: true }
    );
    res.send(updatedProduct);
  } catch (err) {
    res.status(500).send(err);
  }
});

// ❌ Delete Product
app.delete("/delete/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.send("Product deleted successfully");
});

// 🚀 Start Server
app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
