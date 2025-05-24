import React, { useState, useEffect } from "react";
import axios from "axios";
import { Badge } from "react-bootstrap";
import { useCart } from "../hooks/CartContext";
import { Link } from "react-router-dom";
import '../Style/ShoppingCard.css';
import { Toaster, toast } from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

export default function ShoppingCard_Getdata() {
  const [cartItems, setCartItems] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  const { fetchProducts, fetchCartData } = useCart();

  // GET cart data from API
  const GetCartData = async () => {
    try {
      const Shoppingresponse = await axios.get("http://127.0.0.1:5000/shoppingcard/api/shoppingCard/v1");
      setCartItems(Shoppingresponse.data);
      console.log("cart data", Shoppingresponse.data);

      // Count total items in cart
      let totalItems = 0;
      Shoppingresponse.data.forEach((cart) => {  // Use Shoppingresponse.data instead of data
        cart.items.forEach((item) => {
          totalItems += item.quantity;
        });
      });

      setCartItemCount(totalItems);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  // Delete a product from the cart
  const handleDeleteProduct = async (productId, userId) => {
    try {
      // Delete the product by passing userId and productId to the backend route
      await axios.delete(`http://127.0.0.1:5000/shoppingcard/api/shoppingCard/v1/${userId}/${productId}`);
      GetCartData();  // Refresh the cart data
      fetchCartData(); // refresh the cart count
      fetchProducts(); // refrech the product cart
      toast('Product deleted from cart successfully!',
        {
          icon: '👀',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
    } catch (error) {
      console.error("Error deleting product from cart:", error);
      alert("Failed to delete product from cart: " + error.response?.data?.message || error.message);
    }
  };

  // Fetch cart data when the component mounts
  useEffect(() => {
    GetCartData();
  }, []);

  return (
    <div className="container-fulid mt-4">
      <Toaster />
      <h2 className="Main_Heading">
        🎶Shopping Cart <Badge bg="success">{cartItemCount} Items</Badge>
      </h2>
      <div className="container showing_cart">
        {cartItems.length > 0 ? (
          <div className="row">
            {cartItems.map((cart, index) => (
              <div key={index} className="mb-3">
                <div className="bg-light">
                  <div className="p-2 bg-success text-white text-center fw-bold">
                    🎉 Welcome to Shopping Cart!
                  </div>
                  <table className="table table-hover table-bordered table-responsive-md">
                    <thead className="table-dark">
                      <tr className="text-center">
                        <th>Image</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th>Size</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.items.map((item, itemIndex) => (
                        <tr key={itemIndex} className="text-center align-middle">
                          <td>
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "10px",
                                border: "2px solid #ccc",
                              }}
                            />
                          </td>
                          <td><strong>{item.product_name}</strong></td>
                          <td><span className="badge bg-warning">{item.quantity}</span></td>
                          <td>${item.price_at_time.toFixed(2)}</td>
                          <td>${item.total_price.toFixed(2)}</td>
                          <td>{item.size}</td>
                          <td>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDeleteProduct(item.product_id, cart.user_id)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* <div className="p-3">
                    {cart.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="mb-3 p-2 border rounded bg-white">
                       
                        <div className="image_select">
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="image_style"

                          />
                        </div>
                       
                        <div className="heading_display">
                          <h6 className="mb-1">Product: <b>{item.product_name}</b></h6>
                          <p className="mb-1">Quantity: <span className="badge bg-warning">{item.quantity}</span></p>
                          <p className="mb-1">Price: <strong>$ {item.price_at_time}</strong></p>
                          <p className="mb-1">Total: <strong>$ {item.total_price}</strong></p>
                          <p className="mb-1">Size: <strong>{item.size}</strong></p>
                        
                          <button
                            className="btn btn-danger btn-sm "
                            onClick={() => handleDeleteProduct(item.product_id, cart.user_id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div> */}
                  <div className="container order_section
                ">
                    <h5>Total: ${cart.total_price.toFixed(2)}</h5>
                  </div>
                  <hr style={{
                    width: "50%", margin: "20px auto",
                    border: "1px solid black"
                  }} />


                  <div className="container orderBtn_section">
                    <Link
                      to="/orderList"
                      className={`mt-2 btn btn-primary ${cartItemCount === 0 ? "disabled" : ""}`}
                      onClick={(e) => cartItemCount === 0 && e.preventDefault()}
                    >
                      Order ✔
                    </Link>
                  </div>

                </div>
              </div>

            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="spinner-border text-primary" animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          // <p className="alert alert-warning text-center">Your cart is empty!</p>
        )}
      </div>
    </div>
  );
}