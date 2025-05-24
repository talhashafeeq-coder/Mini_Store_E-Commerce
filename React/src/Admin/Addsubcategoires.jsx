import { useEffect, useState } from "react";
import axios from "axios";
import '../Style/Login.css'; {/* Add your CSS file here */ }


const Addsubcategories = () => {
    const [subcategoriesdata, setSubcategoriesdata] = useState([]);
    const [categoriesdata, setCategoriesdata] = useState([]);
    const [addsubcategories, setSubcategories] = useState({
        name: "",category_id: "",description: "",stock: "",price: "",
        quantity: "",created_at: "",status: "active",image: null,
    });

    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch Categories
    useEffect(() => {
        axios.get("http://127.0.0.1:5000/categories/api/category/v1")
            .then(response => {
                console.log("Categories Response:", response.data);
                if (Array.isArray(response.data)) {
                    setCategoriesdata(response.data);
                } else if (Array.isArray(response.data.categories)) {
                    setCategoriesdata(response.data.categories);
                } else {
                    console.error("Invalid categories format:", response.data);
                }
            })
            .catch(error => console.error("Error fetching categories:", error));
    }, []);

    // Handle Image Selection
    const handleImageChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file); // Create a preview URL
            setPreview(imageUrl);
            setSubcategories({ ...addsubcategories, image: file });
        }
    };

    // Submit Form Data
    const handleAddSubcategory = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const formData = new FormData();
            const categoryId = parseInt(addsubcategories.category_id, 10); // Convert to integer
            console.log("category_id (converted to integer):", categoryId); // Debugging
    
            formData.append("name", addsubcategories.name);
            formData.append("category_id", categoryId); // Use the converted integer
            formData.append("description", addsubcategories.description);
            formData.append("stock", addsubcategories.stock);
            formData.append("price", addsubcategories.price);
            formData.append("status", addsubcategories.status);
            formData.append("created_at", new Date().toISOString()); // Add created_at
            formData.append("image", addsubcategories.image); // Append the selected image
    
            const response = await axios.post(
                "http://127.0.0.1:5000/categories/api/subcategory/v1",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
    
            setSubcategoriesdata([...subcategoriesdata, response.data.subcategory]);
            setSubcategories({
                name: "",category_id: "",description: "",
                stock: "",price: "",status: "active",image: null,
            });
    
            setError("");
        } catch (err) {
            console.error("Error:", err);
            setError(err.response?.data?.error || "Failed to add subcategory.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="container bg-danger mt-5">
                <div className="row">
                    <div className="col-md-12 d-flex justify-content-center align-items-center mt-4 ">    
                        <div className="login-box w-100">
                        <h2 className="mb-4 text-center text-light">Add Subctagategory</h2>
                        <form onSubmit={handleAddSubcategory} encType="multipart/form-data">
                        <div className="user-box">
                                <input
                                    type="text"
                                    value={addsubcategories.name}
                                    onChange={(e) => setSubcategories({ ...addsubcategories, name: e.target.value })}
                                    required
                                />
                                <label htmlFor="name" >Name</label>
                                </div>
                                <div className="user-box">
                                <input
                                    type="number"
                                    value={addsubcategories.stock}
                                    onChange={(e) => setSubcategories({ ...addsubcategories, stock: e.target.value })}
                                    required
                                />
                                <label htmlFor="stock">Stock</label>
                                </div>
                                <div className="user-box">
                                <input
                                    type="number"
                                    value={addsubcategories.price}
                                    onChange={(e) => setSubcategories({ ...addsubcategories, price: e.target.value })}
                                    required
                                />
                                <label htmlFor="price"> Price</label>
                                </div>
                                <hr />
                                <div className="form-group mb-3">
                                <label htmlFor="category_id" className="form-label text-light">Category:</label>
                                <select
                                    className="form-select mb-2"
                                    value={addsubcategories.category_id}
                                    onChange={(e) => setSubcategories({ ...addsubcategories, category_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {Array.isArray(categoriesdata) && categoriesdata.length > 0 ? (
                                        categoriesdata.map((category, index) => {
                                            return (
                                                <option key={index} value={category.category_id}>
                                                    {category.category_name}
                                                </option>
                                            );
                                        })
                                    ) : (
                                        <option disabled>No Categories Found</option>
                                    )}
                                </select>
                                <div className="form-group mb-3">
                                <label htmlFor="description" className="form-label text-light">Description :</label>
                                <textarea
                                    className="form-control mb-2"
                                    placeholder="Description"
                                    value={addsubcategories.description}
                                    onChange={(e) => setSubcategories({ ...addsubcategories, description: e.target.value })}
                                /> 
                                </div>                             
                                {/* Image Upload Field */}
                                <label htmlFor="image" className="form-label text-light">Image :</label>
                                <input
                                    type="file"
                                    className="form-control mb-2"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {preview && (
                                    <img src={preview} alt="Preview" width="150px" className="mb-2" style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "5px", marginBottom: "10px" }} />
                                )}<br />

                                <label htmlFor="status" className="form-label mt-5 text-light">Status :</label>
                                <select
                                    className="form-select mb-2"
                                    value={addsubcategories.status}
                                    onChange={(e) => setSubcategories({ ...addsubcategories, status: e.target.value })}
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? "Adding..." : "Add Subcategory"}
                                </button>
                                {error && <p className="text-danger">{error}</p>}
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-12 card_style">
                        <h3>Subcategories</h3>
                        {subcategoriesdata?.length > 0 ? (
                            subcategoriesdata.map((subcategory) => (
                                <div key={subcategory.id} className="">
                                    <div className="card_style ">
                                        <div className="card-body">
                                            <h5 className="card-title">{subcategory.name || "No Name"}</h5>
                                            <p className="card-text">
                                                <img className="img-fluid" src={subcategory.image_url || "N/A"} alt={subcategory.name} /> <br />
                                                <strong>Category:</strong> {subcategory.category_id || "N/A"} <br />
                                                <strong>Description:</strong> {subcategory.description || "No Description"} <br />
                                                <strong>Stock:</strong> {subcategory.stock || "N/A"} <br />
                                                <strong>Price:</strong> ${subcategory.price || "N/A"} <br />
                                                <strong>Status:</strong> {subcategory.status || "N/A"} <br />
                                                <strong>Created At:</strong> {subcategory.created_at || "N/A"}
                                            </p>
                                            <button className="btn btn-primary">View Details</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No Subcategories Found</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Addsubcategories;
