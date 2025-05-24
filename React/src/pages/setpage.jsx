import React from 'react'

export default function setpage() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <h2>Add Subcategory</h2>
                    <form onSubmit={handleAddSubcategory} encType="multipart/form-data">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Name :</label>
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Subcategory Name"
                                value={addsubcategories.name}
                                onChange={(e) => setSubcategories({ ...addsubcategories, name: e.target.value })}
                                required
                            />
                            <label htmlFor="category_id" className="form-label">Category :</label>
                            <select
                                className="form-select mb-2"
                                value={addsubcategories.category_id}
                                onChange={(e) => setSubcategories({ ...addsubcategories, category_id: e.target.value })}
                                required
                            >
                                <option value="">Select Category</option>
                                {categoriesdata.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                            <label htmlFor="description" className="form-label">Description :</label>
                            <textarea
                                className="form-control mb-2"
                                placeholder="Description"
                                value={addsubcategories.description}
                                onChange={(e) => setSubcategories({ ...addsubcategories, description: e.target.value })}
                            />
                            <label htmlFor="stock" className="form-label">Stock :</label>
                            <input
                                type="number"
                                className="form-control mb-2"
                                placeholder="Stock"
                                value={addsubcategories.stock}
                                onChange={(e) => setSubcategories({ ...addsubcategories, stock: e.target.value })}
                            />
                            <label htmlFor="price" className="form-label"> Price :</label>
                            <input
                                type="number"
                                className="form-control mb-2"
                                placeholder="Price"
                                value={addsubcategories.price}
                                onChange={(e) => setSubcategories({ ...addsubcategories, price: e.target.value })}
                            />

                            {/* Image Upload Field */}
                            <label htmlFor="image" className="form-label">Image :</label>
                            <input
                                type="file"
                                className="form-control mb-2"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {preview && <img src={preview} alt="Preview" width="150px" className="mb-2" />}
                            <label htmlFor="status" className="form-label mt-5">Status :</label>
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
                <div className="col-md-6">
                    <h3>Subcategories</h3>
                    {subcategoriesdata?.length > 0 ? (
                        subcategoriesdata.map((subcategory) => (
                            <div key={subcategory.id} className="col-md-4 mb-4">
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">{subcategory.name || "No Name"}</h5>
                                        <p className="card-text">
                                            <img style={{ width: "100px", height: "100px" }} src={subcategory.image_url || "N/A"} alt={subcategory.name} /> <br />
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
    )
}
