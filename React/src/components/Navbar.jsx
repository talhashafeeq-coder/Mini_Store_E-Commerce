import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, Button, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaBell, FaSignOutAlt } from "react-icons/fa";
import '../Style/Navbar.css';
import { useCart } from "../hooks/CartContext";


function Menu() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItemCount, order } = useCart();

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  const handleLogout = () => {
    // Perform logout logic here, such as clearing user data or redirecting to login page
    localStorage.removeItem('token'); // Example: remove token from local storage
    window.location.href = '/login'; // Redirect to login page
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  
  }, []);

  return (
    <Navbar
      expand="lg"
      className={`navbar-custom ${isScrolled ? 'scrolled' : ''}`}
      fixed="top"
    >
      <div className='container'>
        <Link to="/" className="navbar-brand" id="brand">
          Store 🎶
        </Link>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/show" className="nav-link">
              All Product
            </Link>
          </Nav>

          {/* User Icon */}
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="user-tooltip">Admin Panel</Tooltip>}
            >
          <Button
            variant="outline-warning me-2 position-relative py-1 px-2"
            as={Link}
            to="/dashboard"
            style={{ fontSize: '0.8rem' }}
          >
            <FaUser size={13} />
          </Button>
          </OverlayTrigger>

          {/* Cart Icon with Badge */}
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="cart-tooltip">Shopping Cart</Tooltip>}
          >
          <Button
            variant="outline-success me-2 position-relative py-1 px-2"
            as={Link}
            to="/ShoppingCard"
            style={{ fontSize: '0.8rem' }}
          >
            <FaShoppingCart size={13} />
            {cartItemCount > 0 && (
              <Badge
                pill
                bg="dark"
                className="position-absolute top-0 start-100 translate-middle"
                style={{ fontSize: '0.65rem', padding: '0.25em 0.4em' }}
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>
          </OverlayTrigger>

          {/* Notification Icon with Order Count */}
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="order-tooltip">Orders</Tooltip>}
          >
          <Button
            variant="outline-info me-2 position-relative py-1 px-2"
            as={Link}
            to="/order"
            style={{ fontSize: '0.8rem' }}
          >
            <FaBell size={13} />
            {order > 0 && (
              <Badge
                pill
                bg="dark"
                className="position-absolute top-0 start-100 translate-middle"
              >
                {order}
              </Badge>
            )}
          </Button>
          </OverlayTrigger>

          {/* Logout Button */}
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="logout-tooltip">Logout</Tooltip>}
          >
            <Button
              variant="outline-danger me-2 position-relative py-1 px-2 "
              onClick={handleLogout} // Add your logout logic here
              style={{ fontSize: '0.8rem' }}
            >
              <FaSignOutAlt size={13} />
            </Button>
          </OverlayTrigger>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default Menu;
