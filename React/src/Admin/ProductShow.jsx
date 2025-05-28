import { useState, useEffect } from "react";
import axios from "axios";
import "../Style/ProductShow.css"

export default function ProductShow() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 👇 Data fetch karne wala function
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/product/api/product/v1");
        setProducts(response.data);
      } catch (err) {
        setError("Product fetch nahi ho saka. Dobara try karein.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 fancy-heading">🛒 Total Products: {products.length}</h2>

      {/* 👉 Agar error aaye to ye show kare */}
      {error && (
        <div className="alert alert-danger text-center">
          ⚠️ {error}
        </div>
      )}

      {/* 👉 Jab tak data load ho raha ho */}
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* 👉 Table show karein jab loading khatam ho jaye */}
      {!loading && (
        <div className="table-container">
          <table className="table custom-table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Naam</th>
                <th>Description</th>
                <th>Price ($)</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Subcategory</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="product-img"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.description.substring(0, 50)}...</td>
                    <td>${product.price}</td>
                    <td>{product.stock_quantity}</td>
                    <td>{product.category_name}</td>
                    <td>{product.subcategory_name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">Koi product nahi mila.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
