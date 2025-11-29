const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");

const app = express();
app.use(express.json());
app.use(express.static("public")); // serve frontend


mongoose.connect(process.env.MONGO_URI, { //connection string set at the environment variable of render.
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("DB Connection Error:", err));

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

//get all available products
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

app.listen(5000, () => {
  console.log("Server running");
});

const cors = require('cors');
const allowedOrigin = process.env.FRONTEND_URL || 'https://prod-info.netlify.app/'; // or your netlify URL

app.use(cors({
  origin: allowedOrigin,   // or '*' during debugging
  methods: ['GET','POST','PUT','DELETE'],
}));

