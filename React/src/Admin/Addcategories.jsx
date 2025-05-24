import React, { useState, useEffect } from "react";
import axios from "axios";
import IndexUrl from "../hooks/IndexUrl";
import { FaArrowLeft } from "react-icons/fa"; {/* Importing FontAwesome icons */ }
import '../Style/Login.css'; {/* Add your CSS file here */ }

export default function Addcategories() {
  const [categoriesdata, setCategoriesdata] = useState([]);
  const [addcategories, setCategories] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addCategories = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/categories/api/category/v1",
        addcategories
      );
      // console.log("Post Data:", response.data);
      setCategoriesdata((prev) => [...prev, response.data.category]); // Fix: Ensure list updates correctly
      setCategories({ name: "" }); // Reset form
      setError(""); // Clear errors
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add category.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/categories/api/category/v1");
      // console.log("Fetched Data:", response.data); // Debugging
      setCategoriesdata(Array.isArray(response.data.categories) ? response.data.categories : []);
    } catch (err) {
      setError("Failed to fetch categories.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container-fluid bg-danger">
      <IndexUrl.CheckUserlogin />
      <button className="btn mt-2 mb-2" onClick={() => window.history.back()}>
                  <FaArrowLeft style={{ fontSize: "22px" }} />
                </button>
      <div className="container   mt-5">
        <div className="row">
          <div className="col-md-6">
              <div className="card-body login-box ">
              <div className="user-box">
                <form onSubmit={addCategories}>

                  <div className="user-box p-2">             
                    <input
                      type="text"
                     
                      id="name"
                      value={addcategories.name}
                      onChange={(e) => setCategories({ ...addcategories, name: e.target.value })}
                      required
                    />
                     <label htmlFor="name" >Name</label>
                  </div>
                  <button type="submit" className="btn btn-primary mb-2" disabled={loading}>
                    {loading ? "Adding..." : "Submit"}
                  </button>
                  {error && <p className="text-danger mt-2">{error}</p>}
                </form>
                </div>
              </div>
            </div>
          
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Categories</h5>
                <ul className="list-group">
                  {categoriesdata.map((category,index) => (
                    <li className="list-group-item" key={index}>
                      {category.category_name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <IndexUrl.Addsubcategoires />
      <IndexUrl.SizeManagement />
    </div>
  );
}
