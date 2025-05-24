import React, { useState, useEffect } from 'react'
import axios from "axios";
import '../Style/Login.css'; {/* Add your CSS file here */ }
import { FaArrowLeft } from "react-icons/fa"; {/* Importing FontAwesome icons */ }




export default function Addproduct() {
  const [categories, setCategories] = useState([]); {/* State to hold categories */ }
  const [subcategories, setSubCategories] = useState([]); {/* State to hold subcategories */ }
  const [preview, setPreview] = useState(null); {/* State to hold image preview */ }
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', description: '', stock_quantity: '',
    image_url: '', category_id: '', subcategory_id: '', mrsp: '',
    discount: '', old_price: ''
  })
  {/* State to hold new product data */ }


  // ✅ Fetch categories and subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, subCategoriesRes] = await Promise.all([
          axios.get("http://127.0.0.1:5000/categories/api/category/v1"),
          axios.get("http://127.0.0.1:5000/categories/api/subcategory/v1"),
        ]);
        // console.log("🔍 Categories API Response:", categoriesRes.data);
        // console.log("🔍 Subcategories API Response:", subCategoriesRes.data);
        setCategories(categoriesRes.data.categories || []);
        setSubCategories(subCategoriesRes.data);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0]; if (file) {
      const reader = new FileReader(); reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setNewProduct((prevProduct) => ({ ...prevProduct, image: file }));
    }
  };
  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`🛠 Updating: ${name} ->`, value); // Debugging

    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value, // ✅ Let React handle type conversion automatically
    }));
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("📤 Sending Data:", newProduct); // Debugging before sending request

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("stock_quantity", newProduct.stock_quantity);
    formData.append("category_id", newProduct.category_id);
    formData.append("subcategory_id", newProduct.subcategory_id);
    formData.append("image", newProduct.image);
    formData.append("mrsp", newProduct.mrsp);
    formData.append("discount", newProduct.discount);
    formData.append("old_price", newProduct.old_price);


    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/product/api/product/v1",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } });
      alert("✅ Product Created Successfully!");
      console.log("Response:", response.data);

      //       // Reset form
      setNewProduct({
        name: "", price: "", description: "", stock_quantity: "",
        category_id: "", subcategory_id: "", image: null, mrsp: "",
        discount: "", old_price: ""
      });
      setPreview(null);
    } catch (error) {
      if (error.response) {
        console.error("🔴 API Error:", error.response.data);
        alert(`❌ Error: ${error.response.data.error || error.response.data.message}`);
      } else if (error.request) {
        console.error("🟠 No response from server:", error.request);
        alert("❌ No response from server. Check backend.");
      } else {
        console.error("⚠️ Request Error:", error.message);
        alert("❌ Request error: " + error.message);
      }
    }
  };

  return (
    <>
      <div className="container-fulid bg-danger">
        <button className="btn mt-2 mb-2" onClick={() => window.history.back()}>
          <FaArrowLeft style={{ fontSize: "22px" }} />
        </button>
        <div className="container"> {/* Main container */ }
          <div className="row">
            <div className="col-md-12 d-flex justify-content-center align-items-center mt-4">
              <div className="login-box w-100" style={{ maxWidth: '800px' }}>
                <h2 className="mb-4 text-center text-light">Create Product</h2>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* First Half */}
                    <div className="col-md-6">
                      <div className="user-box">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={newProduct.name}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, name: e.target.value })
                          }
                          required
                        />
                        <label>Name</label>
                      </div>
                      <div className="user-box">
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={newProduct.price}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, price: e.target.value })
                          }
                          required
                        />
                        <label htmlFor="price">Price</label>
                      </div>
                      <div className="user-box">
                        <input
                          type="number"
                          id="discount"
                          name="discount"
                          value={newProduct.discount}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              discount: e.target.value,
                            })
                          }
                          required
                        />
                        <label>Discount</label>
                      </div>
                      <div className="user-box">
                        <input
                          type="number"
                          id="mrsp"
                          name="mrsp"
                          value={newProduct.mrsp}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, mrsp: e.target.value })
                          }
                          required
                        />
                        <label htmlFor="mrsp">Mrsp</label>
                      </div>
                      <div className="user-box">
                        <input
                          type="number"
                          id="oldprice"
                          name="oldprice"
                          value={newProduct.old_price}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              old_price: e.target.value,
                            })
                          }
                          required
                        />
                        <label htmlFor="oldprice">Old Price</label>
                      </div>
                      <div className="user-box">
                        <input
                          type="number"
                          id="stock_quantity"
                          name="stock_quantity"
                          value={newProduct.stock_quantity}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              stock_quantity: e.target.value,
                            })
                          }
                          required
                        />
                        <label htmlFor="stock_quantity">Stock Quantity</label>
                      </div>
                    </div>

                    {/* Second Half */}
                    <div className="col-md-6">
                      <div className="mt-3">

                        <label htmlFor="subcategory" className="form-label  text-light">
                          Category
                        </label>
                        <select
                          className="form-select"
                          name="category_id"
                          value={newProduct.category_id}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map((category, index) => (
                            <option key={index} value={category.category_id}>
                              {category.category_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-3">
                        <label htmlFor="subcategory" className="form-label text-light">
                          Subcategory
                        </label>
                        <select
                          className="form-select"
                          name="subcategory_id"
                          value={newProduct.subcategory_id}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Subcategory</option>
                          {subcategories.map((subcategory, index) => (
                            <option key={index} value={subcategory.id}>
                              {subcategory.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-3">
                        <label htmlFor="description" className="form-label  text-light">
                          Description
                        </label>
                        <textarea
                          className="form-control"
                          rows="4"
                          id="description"
                          name="description"
                          value={newProduct.description}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mt-3">
                        <label htmlFor="subcategory" className="form-label text-light">
                          Upload Image
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                        />
                        {preview && (
                          <img
                            src={preview}
                            alt="Preview"
                            width="150px"
                            className="mt-2 border rounded"
                          />
                        )}
                      </div>
                      <button type="submit" className="btn button mt-3 text-light">
                        Create Product
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
