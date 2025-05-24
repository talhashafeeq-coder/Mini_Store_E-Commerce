import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/CartContext';
import { Toaster, toast } from 'react-hot-toast';
import GetCategory_Navbar from './GetCategory_Navbar';
import AOS from 'aos';
import { FiBell, FiMoon, FiSearch } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import '../Style/DisplayProject.css';

export default function DisplayProject() {
  const navigate = useNavigate();
  const { products, loading, message } = useCart();

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  const handleMoreDetails = (id) => {
    toast.success('Redirecting to details...');
    setTimeout(() => {
      navigate(`/productDetails/${id}`);
    }, 1000);
  };

  return (
    <>
      <GetCategory_Navbar />
      <Toaster />

      {/* --- TOP NAVBAR --- */}
      {/* <nav className="navbar navbar-light bg-white shadow-sm sticky-top px-3 py-2">
        <div className="d-flex align-items-center w-100 justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <FiSearch className="fs-4 text-secondary" />
            <input
              type="text"
              placeholder="Search products..."
              className="form-control border-0 shadow-none"
              style={{ maxWidth: '250px', background: '#f1f3f5' }}
            />
          </div>
          <div className="d-flex align-items-center gap-3">
            <FiBell className="fs-5 position-relative" />
            <FiMoon className="fs-5" />
            <FaUserCircle className="fs-4 text-secondary" />
          </div>
        </div>
      </nav> */}

      {/* --- PRODUCT SECTION --- */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="display-title">🚀 Latest Products</h2>
          <p className="lead text-muted">Explore our newest arrivals and trending items.</p>
        </div>

        {loading && (
          <div className="text-center my-4 spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}

        {message && <p className="text-center text-muted">{message}</p>}

        <div className="row">
          {products.map((product) => (
            <div
              className="col-lg-3 col-md-6 col-sm-12 mb-4"
              key={product.id}
              data-aos="fade-up"
            >
              <div
                className="product-card h-100"
                onClick={() => handleMoreDetails(product.id)}
              >
                <div className="img-container position-relative">
                  <img
                    loading="lazy"
                    src={product.image_url}
                    alt={product.name}
                    className="card-img-top rounded-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  {product.discount && (
                    <span className="badge bg-danger discount-badge">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="product-title text-truncate mb-2" title={product.name}>
                    {product.name}
                  </h5>
                  <p className="product-description text-muted text-truncate mb-2" title={product.description}>
                    {product.description}
                  </p>
                  <p className="product-price mt-auto fw-semibold">${product.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
