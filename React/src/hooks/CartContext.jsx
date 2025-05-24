import React ,{ createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context
const CartContext = createContext();

// CartProvider Component
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [categories, setCategories] = useState([]); // State for categories
  const [products, setProducts] = useState([]); // State for products
  const [loading, setLoading] = useState(false); // Loading state for products
  const [message, setMessage] = useState(""); // Error message for products
  const [order, setOrder] = useState([]); // State for order

  // Fetch cart data
  const fetchCartData = async () => {
    try {
      const fetchShoppingData = await axios.get("http://127.0.0.1:5000/shoppingcard/api/shoppingCard/v1");
      const data = fetchShoppingData.data;
      setCartItems(data);

      // Count total items in cart
      let totalItems = 0;
      data.forEach((cart) => {
        cart.items.forEach((item) => {
          totalItems += item.quantity;
        });
      });

      setCartItemCount(totalItems);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  // Fetch products data
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const fectchproductdata = await axios.get("http://127.0.0.1:5000/product/api/product/v1");
      // console.log("API Response:", fectchproductdata.data);
      setProducts(fectchproductdata.data || []); // Use response.data directly
      setLoading(false);
    } catch (err) {
      console.error("API Error:", err.fectchproductdata ? err.fectchproductdata.data : err);
      setProducts([]); // Ensure products is always an array
      setMessage("Failed to fetch products. Please try again later.");
      setLoading(false);
    }
  };
  // Fetch order data 
  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:5000/order/api/order/v1");
      // console.log("API Response:", response.data);
      setOrder(response.data || []); // Use response.data directly
      setLoading(false);
    }
    catch (err) {
      console.error("API Error:", err.response ? err.response.data : err);
      setOrder([]); // Ensure products is always an array
      setMessage("Failed to fetch order. Please try again later.");
      setLoading(false);
    }
  }
 

// Fetch categories data
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:5000/categories/api/category/v1');
        setCategories(response.data.categories || []);
        setLoading(false);
      } catch (error) {
        setError(error);
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
      }

 


  // Fetch both cart and products data on component mount
  // useEffect(() => {
   
  //   fetchCartData();
  //   fetchProducts();
  //   fetchOrderData();
    // if (products === null){
    //   fetchProducts(); 
    //  }
  // }, []); // Empty dependency array to run only on mount
  useEffect(() => {
    if (cartItems.length === 0) fetchCartData();
    if (products.length === 0) fetchProducts();
    if (order.length === 0) fetchOrderData();
    if (categories.length === 0) fetchCategories(); 
  }, []);

  // show loading message
  if (loading) {
    return (
      <div className="text-center">
      <div className="spinner-border text-primary mt-5" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
    );
  }
  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemCount,
        fetchCartData,
        fetchProducts,
        products,
        loading,
        message,
        order,
        fetchCategories,
        categories
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// useCart Hook
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
export default CartContext;
