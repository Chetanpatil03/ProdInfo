const BASE_URL = "https://prodinfo-n7yn.onrender.com";

// Load all products when page opens
window.onload = loadProducts;

// Fetch and display all products
async function loadProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  const products = await res.json();

  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  products.forEach(product => {
    productList.innerHTML += `
      <div class="product-card">
        <h3>${product.name}</h3>
        <p>💰 Price: ${product.price}</p>
        <p>📦 Stock: ${product.stock}</p>
        <button onclick="deleteProduct('${product._id}')">Delete</button>
        <button onclick="editProduct('${product._id}')">Edit</button>
      </div>
    `;
  });
}

// To add new product
document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const stock = document.getElementById("stock").value;

  const res = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, stock })
  });

  if (res.ok) {
    alert("Product added!");
    document.getElementById("productForm").reset();
    loadProducts();
  }
});

// To delete product
async function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    await fetch(`${BASE_URL}/delete/${id}`, { method: "DELETE" });
    loadProducts();
  }
}

async function editProduct(id) {
  const newName = prompt("Enter new product name:");
  const newPrice = prompt("Enter new price:");
  const newStock = prompt("Enter new stock:");

  if (newName && newPrice && newStock) {
    await fetch(`${BASE_URL}/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, price: newPrice, stock: newStock })
    });
    loadProducts();
  }
}
