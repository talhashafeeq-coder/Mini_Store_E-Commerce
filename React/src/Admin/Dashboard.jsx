import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import IndexUrl from "../hooks/IndexUrl";
import { FaUsers, FaBox, FaLayerGroup, FaMoneyBillWave, 
  FaTags, FaUserFriends, FaBars,FaSadCry, FaPlus, FaShoppingCart } from "react-icons/fa";
import DarkModeToggle from "react-dark-mode-toggle";
import "../Style/AdminPage.css"; // Import the CSS file 
export default function Dashboard() {
  const [addproduct, setAddProduct] = useState(0);
  const [adduser, setAddUser] = useState(0);
  const [profit, setProfit] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const navigate = useNavigate();

  // Load theme from localStorage (Persist on reload)
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  // DARk MODE
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/user/api/user/v1");
        setAddUser(response.data.length);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchProduct = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/product/api/product/v1");
        setAddProduct(response.data.length);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    const fetchProfit = async () => {
      try {
        const fetchdataProfit = await axios.get("http://127.0.0.1:5000/order/api/sales-profit");
        setProfit(fetchdataProfit.data);
        console.log("DATA FetchProfit", fetchdataProfit)
      } catch (error) {
        console.log("Error fetching", error)
      }
    }

    fetchUsers();
    fetchProduct();
    fetchProfit();

    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`dashboard-container ${sidebarOpen ? "sidebar-open" : "sidebar-closed"} ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <FaBars />
        </button>
        <h2 className="sidebar-title">Admin Panel</h2>
        <ul className="sidebar-menu">
          <li>
            <Link to="/productshow">
              <FaBox className="icon" /> <span>All Products</span>
            </Link>
          </li>
          <li>
            <Link to="/addproduct">
              <FaPlus className="icon" /> <span>Add Product</span>
            </Link>
          </li>
          <li>
            <Link to="/addcategories">
              <FaLayerGroup className="icon" /> <span>Add Categories</span>
            </Link>
          </li>
          <li>
            <Link to="/userget">
              <FaUserFriends className="icon" /> <span>Available Users</span>
            </Link>
          </li>
          <li>
            <Link to="/orderget">
              <FaShoppingCart className="icon" /> <span>Order</span>
            </Link>
          </li>
          <li>
            <Link to="/return">
              <FaSadCry className="icon" /> <span>Return</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
               {/* Dark Mode Toggle */}
        <div style={{ textAlign: "right", padding: "10px" }}>
          <DarkModeToggle onChange={setIsDarkMode} checked={isDarkMode} size={80} />
        </div>



        {/* Cards Section */}
        <div className="dashboard-row">
          <div className="dashboard-card" style={{ backgroundColor: "tan" }} onClick={() => navigate("/productshow")}>
            <FaBox className="dashboard-icon" />
            <div className="dashboard-info">
              <h2>{addproduct}</h2>
              <p>Total Products</p>
            </div>
          </div>

          <div className="dashboard-card" style={{ backgroundColor: "gray" }} onClick={() => navigate("/userget")}>
            <FaUsers className="dashboard-icon" />
            <div className="dashboard-info">
              <h2>{adduser}</h2>
              <p>Total Users</p>
            </div>
          </div>

          <div className="dashboard-card" style={{ backgroundColor: "green" }}>
            <FaMoneyBillWave className="dashboard-icon" />
            <div className="dashboard-info">
              <h2>{profit.total_profit} $</h2> {/* Corrected this line */}
              <p>Total Profit</p>
            </div>
          </div>
          <div className="dashboard-card" style={{ backgroundColor: "blue" }}>
            <FaTags className="dashboard-icon" />
            <div className="dashboard-info">
              <h2>{profit.total_sales} $</h2> {/* Corrected this line */}
              <p>Total Sale</p>
            </div>
          </div>
        </div>
        <IndexUrl.SaleChart />
        <hr /><hr />
        <IndexUrl.CurrentstatusChart />
        <hr /><hr />
      </div>
    </div>
  );
}