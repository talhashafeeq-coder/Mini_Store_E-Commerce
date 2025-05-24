import React, { useEffect, useState } from "react";
import axios from "axios";
import '../Style/Login.css'; {/* Add your CSS file here */ }


const SizeManagement = () => {
    const [sizes, setSizes] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [formData, setFormData] = useState({
        size: "",product_id: "",quantity: "",
    });

    // Fetch sizes and subcategories on component mount
    useEffect(() => {
        fetchSizes();
        fetchSubcategories();
    }, []);

    const fetchSizes = async () => {
        try {
            const res = await axios.get("http://localhost:5000/categories/api/size/v1");
            // console.log(
            //     "Sizes fetched successfully",
            //     res.data
            // )
            setSizes(res.data);
        } catch (error) {
            console.error("Error fetching sizes:", error);
        }
    };
    const fetchSubcategories = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:5000/product/api/product/v1");
            // console.log(
            //     "Subcategories fetched successfully",
            //     res.data
            // )
            setSubcategories(res.data);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };
    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/categories/api/size/v1", formData, {
                headers: { "Content-Type": "application/json" }
            });
            fetchSizes(); // Refresh the list
            // console.log("Size added successfully");
            setFormData({ size: "", product_id: "", quantity: "" });
        } catch (error) {
            console.error("Error adding size:", error);
        }
    };

    return (
        <div className="container bg-danger">
        <div className="col-md-12 d-flex justify-content-center align-items-center mt-4">
        <div className="login-box w-100" style={{ maxWidth: '800px' }}>
          <h2 className="mb-4 text-center text-light">Size Management</h2>

            {/* Form for adding a new size */}
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="user-box">
                    <input
                        type="text"
                        name="size"
                       
                        value={formData.size}
                        onChange={handleChange}
                        required
                    />
                    <label >Size</label>
                </div>
                <div className="user-box">
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />
                      <label >Quantity:</label>
                </div>

                <hr />
                <div className="mb-3">
                    <label className="form-label text-light">Product:</label>
                    <select
                        name="product_id"
                        className="form-control"
                        value={formData.product_id
                        }
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select ProductName</option>
                        {subcategories.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                                {sub.name}
                            </option>
                        ))}
                    </select>
                </div>

                
                <button type="submit" className="btn btn-primary">Add Size</button>
            </form>

            {/* Display sizes */}
            {/* <h3>Existing Sizes</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Size</th>
                        <th>Subcategory</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {sizes.map((size) => (
                        <tr key={size.id}>
                            <td>{size.size}</td>
                            <td>{size.product_id || "N/A"}</td>
                            <td>{size.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
        </div>
        </div>
        </div>
    );
};

export default SizeManagement;
