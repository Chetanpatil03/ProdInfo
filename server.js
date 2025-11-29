// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");           // <- require at top
const Product = require("./models/Product");

const app = express();

app.use(express.json());

// serve frontend only if you actually host frontend in the same project
// if your frontend is on Netlify, you can remove this or leave it harmless
app.use(express.static("public"));

// CORS config - allow your Netlify URL (no trailing slash)
const allowedOrigin = process.env.FRONTEND_URL || "https://prod-info.netlify.app";
app.use(cors({
  origin: allowedOrigin,   // or '*' temporarily to debug
  methods: ['GET','POST','PUT','DELETE']
}));

// connect to MongoDB (MONGO_URI from Render env vars)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("DB Connection Error:", err));

// Routes
app.post("/add", async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const product = new Product({ name, price, stock });
    await product.save();
    res.status(201).send(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

app.put("/update/:id", async (req, res) => {
  try {
    const { name, price, stock } = req.body;
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

app.delete("/delete/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.send("Product deleted successfully");
});

// Use the port from environment (Render sets it), fallback to 5000 locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
