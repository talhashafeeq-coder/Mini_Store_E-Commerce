import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Spinner, Offcanvas, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const CATEGORIES_API = "http://127.0.0.1:5000/categories/api/subcategory/category/v1";
const PRODUCTS_API = "http://127.0.0.1:5000/categories/api/subcategory/v1";

const CategoryPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [error, setError] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Debounce function to prevent rapid API calls
  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Fetch all categories for filters
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(CATEGORIES_API);
      setCategories(res.data);
      setLoadingFilters(false);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load filters. Please try again later.");
      setLoadingFilters(false);
    }
  }, []);

  // Fetch products based on selected categories
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let url = `${PRODUCTS_API}?category_id=${id}`;
      
      // Add category filters if any are selected
      if (selectedCategories.length > 0) {
        url += `&filter_categories=${selectedCategories.join(",")}`;
      }
      
      const res = await axios.get(url);
      const allProducts = res.data.flatMap(subcategory => 
        subcategory.category?.products || []
      );
      setProducts(allProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    }
    setLoading(false);
  }, [id, selectedCategories]);

  // Initialize - fetch both categories and products
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  // Handle category selection
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Debounced search handler
  const handleSearchChange = debounce((value) => {
    setSearch(value);
  }, 300);

  // Filter and sort products
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price") return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#">MyShop</a>
          
          {/* Mobile filter toggle button */}
          <Button 
            variant="outline-primary" 
            className="d-md-none me-2"
            onClick={() => setShowMobileFilters(true)}
          >
            <i className="bi bi-funnel"></i> Filters
          </Button>
          
          <form className="d-flex ms-auto">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </form>
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-cart fs-4"></i>
            <i className="bi bi-person-circle fs-4"></i>
          </div>
        </div>
      </nav>

      <div className="row mt-4">
        {/* Desktop Filters Sidebar */}
        <div className="col-md-3 d-none d-md-block">
          <div className="border p-3 rounded shadow-sm sticky-top" style={{ top: "80px" }}>
            <h5 className="mb-3">Filters</h5>
            
            {/* Categories Filter */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3">Categories</h6>
              {loadingFilters ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <div className="form-check">
                  {categories.map((category) => (
                    <div key={category.id} className="mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                      />
                      <label 
                        className="form-check-label ms-2" 
                        htmlFor={`category-${category.id}`}
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Price Range Filter (example) */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3">Price Range</h6>
              <div className="d-flex align-items-center gap-2">
                <input 
                  type="number" 
                  className="form-control form-control-sm" 
                  placeholder="Min" 
                />
                <span>to</span>
                <input 
                  type="number" 
                  className="form-control form-control-sm" 
                  placeholder="Max" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters Offcanvas */}
        <Offcanvas 
          show={showMobileFilters} 
          onHide={() => setShowMobileFilters(false)}
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Filters</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {/* Categories Filter */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3">Categories</h6>
              {loadingFilters ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <div className="form-check">
                  {categories.map((category) => (
                    <div key={category.id} className="mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`mobile-category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                      />
                      <label 
                        className="form-check-label ms-2" 
                        htmlFor={`mobile-category-${category.id}`}
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Price Range Filter (example) */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3">Price Range</h6>
              <div className="d-flex align-items-center gap-2">
                <input 
                  type="number" 
                  className="form-control form-control-sm" 
                  placeholder="Min" 
                />
                <span>to</span>
                <input 
                  type="number" 
                  className="form-control form-control-sm" 
                  placeholder="Max" 
                />
              </div>
            </div>
            
            <Button 
              variant="primary" 
              className="w-100 mt-3"
              onClick={() => setShowMobileFilters(false)}
            >
              Apply Filters
            </Button>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Products Section */}
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item"><a href="#">MAN</a></li>
                <li className="breadcrumb-item active" aria-current="page">Rings</li>
              </ol>
            </nav>

            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small d-none d-sm-block">Sort by:</span>
              <select
                className="form-select w-auto"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="price">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {selectedCategories.length > 0 && (
            <div className="mb-3">
              <div className="d-flex flex-wrap gap-2">
                {selectedCategories.map(catId => {
                  const category = categories.find(c => c.id === catId);
                  return category ? (
                    <span key={catId} className="badge bg-primary">
                      {category.name}
                      <button 
                        className="ms-2 btn-close btn-close-white" 
                        style={{ fontSize: '0.5rem' }}
                        onClick={() => handleCategoryToggle(catId)}
                      ></button>
                    </span>
                  ) : null;
                })}
                {selectedCategories.length > 0 && (
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => setSelectedCategories([])}
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          )}

          {loading && (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
              <Spinner animation="border" />
              <span className="ms-2">Loading products...</span>
            </div>
          )}

          {error && !loading && (
            <div className="alert alert-danger">{error}</div>
          )}

          {filteredProducts.length === 0 && !loading && !error ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
              <div className="text-center">
                <i className="bi bi-exclamation-circle fs-1 text-muted"></i>
                <p className="mt-2">No products found matching your filters</p>
                <button 
                  className="btn btn-primary mt-2"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSearch("");
                  }}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="row">
              {sortedProducts.map((product) => (
                <div key={product.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                  <div className="card product-card h-100 shadow-sm border-0">
                    <div className="position-relative">
                      <img
                        src={product.image_url}
                        className="card-img-top"
                        alt={product.name}
                        style={{ height: '220px', objectFit: 'cover' }}
                      />
                      <div className="wishlist-icon">
                        <i className="bi bi-heart-fill"></i>
                      </div>
                      <div className="quick-view-overlay">
                        <button className="btn btn-light btn-sm">Quick View</button>
                      </div>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title text-truncate">{product.name}</h6>
                      <p className="card-text text-muted mb-2">
                        ${product.price ? Number(product.price).toFixed(2) : 'N/A'}{' '}
                        {product.old_price && (
                          <del className="ms-2 text-danger">
                            ${Number(product.old_price).toFixed(2)}
                          </del>
                        )}
                      </p>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-star-fill text-warning me-1"></i>
                        {/* <span>{product.rating.toFixed(1)}</span> */}
                      </div>
                      <div className="mt-auto d-flex gap-2">
                        <button className="btn btn-sm btn-primary ">Add to Cart</button>
                        <button className="btn btn-sm btn-outline-secondary ">View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;