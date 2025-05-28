import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../Style/ProductDetails.css";
import IndexUrl from "../hooks/IndexUrl";
import JwttokenGet from "../hooks/JwttokenGet";
import { useCart } from "../hooks/CartContext";
import { Toaster, toast } from "react-hot-toast";
import ReactImageMagnify from "react-image-magnify";
import { FaStar, FaHeart, FaShareAlt } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchCartData, fetchProducts } = useCart();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/product/api/product/v1/${id}`
        );
        const productData = response.data.product || {};
        console.log("Product Details:", productData);

        setProduct(productData);

        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0].size);
          setQuantity(productData.sizes[0].quantity);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details.");
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleSizeChange = (event) => {
    const selected = event.target.value;
    setSelectedSize(selected);
    const selectedSizeData = product.sizes.find((item) => item.size === selected);
    setQuantity(selectedSizeData ? selectedSizeData.quantity : 0);
  };

  const handleAddToCart = async (productId) => {
    const userId = JwttokenGet();

    if (!userId) {
      toast.error("Please log in to add products to the cart.");
      return;
    }

    const selectedSizeData = product.sizes.find((item) => item.size === selectedSize);
    if (!selectedSizeData || selectedSizeData.quantity <= 0) {
      toast.error("Selected size is out of stock.");
      return;
    }

    const payload = {
      user_id: userId,
      product_id: productId,
      size: selectedSize,
      quantity: 1,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/shoppingcard/api/shoppingCard/v1",
        payload
      );
      console.log("Product added to cart:", response.data);
      toast.success("Order Successful! 🎉");
      fetchProducts();
      fetchCartData();
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart.");
    }
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-5 text-center">{error}</div>;
  }

  return (
    <>
      <IndexUrl.CheckUserlogin />
      <Toaster />
      <div className="container main-container mt-5 py-5">
        <div className="product-grid">
          {/* Image Section */}
          <div className="image-section">
            {isMobile ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="main-image"
                style={{ width: "100%", padding: "10px", border: "1px solid #eee" }}
              />
            ) : (
              <ReactImageMagnify
                {...{
                  smallImage: {
                    alt: product.name,
                    isFluidWidth: true,
                    src: product.image_url,
                  },
                  largeImage: {
                    src: product.image_url,
                    width: 1200,
                    height: 1800,
                  },
                }}
                className="main-image"
              />
            )}
            <div className="thumbnails">
              <img
                src={product.image_url}
                alt="thumbnail"
                className="thumbnail active"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="details-section">
            <h2 style={{ fontWeight: 700 }}>{product.name}</h2>
            <div className="price-section mb-3">
              <span className="final-price">${product.price}</span>
              {product.old_price && (
                <span className="original-price">${product.old_price}</span>
              )}
              {product.discount > 0 && (
                <span className="discount">({product.discount}% OFF)</span>
              )}
            </div>

            <p className="text-muted">{product.description}</p>

            <div className="tags">
              <span className="tag in-stock">In Stock</span>
              <span className="tag best-seller">Best Seller</span>
              <span className="tag limited">Limited Edition</span>
            </div>

            <div className="size-selector">
              <label htmlFor="size">Select Size:</label>
              {product.sizes && product.sizes.length > 0 ? (
                <select
                  id="size"
                  value={selectedSize}
                  onChange={handleSizeChange}
                >
                  {product.sizes.map((item, index) => (
                    <option
                      key={index}
                      value={item.size}
                      disabled={item.quantity <= 0}
                    >
                      {item.size} {item.quantity <= 0 ? "(Out of Stock)" : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-muted">No Sizes Available</p>
              )}
            </div>

            <div className="quantity-selector mt-3">
              <p>
                <strong>Stock:</strong> {quantity > 0 ? quantity : "Out of Stock"}
              </p>
            </div>

            <div className="action-buttons">
              <button
                className="btnStyle add-to-cart"
                disabled={quantity <= 0}
                onClick={() => handleAddToCart(product.id)}
              >
                Add to Cart
              </button>
              <button className="btnStyle buy-now">Buy Now</button>
            </div>

            <div className="social-actions">
              <button>
                <FaHeart /> Wishlist
              </button>
              <button>
                <FaShareAlt /> Share
              </button>
              <button>
                <FaStar /> Rate
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
