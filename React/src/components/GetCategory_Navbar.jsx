import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useCart } from '../hooks/CartContext';
import '../Style/GetCategory_Navbar.css';
import { Link } from 'react-router-dom';

export default function GetCategories_Navbar() {
  const { categories = [], loading, error } = useCart();

  if (loading) return <div className="loading-nav">Loading categories...</div>;
  if (error) return <div className="error-nav">Error loading categories.</div>;

  return (
    <Navbar expand="lg" className="custom-navbar shadow-sm">
      <div className="container">
        {/* <Navbar.Brand as={Link} to="/" className="brand-text">
          MyStore
        </Navbar.Brand> */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* <Nav.Link as={Link} to="/" className="nav-link-custom">Home</Nav.Link> */}
            {categories.length > 0 ? (
              categories.map((category) => (
                <NavDropdown
                  key={category.category_id}
                  title={category.category_name}
                  id={`category-dropdown-${category.category_id}`}
                  className="nav-dropdown-custom"
                >
                  {category.subcategories.length > 0 ? (
                    category.subcategories.map((sub) => (
                      <NavDropdown.Item
                        as={Link}
                        to={`/subcategory/${sub.id}`}
                        key={sub.id}
                        className="dropdown-item-custom"
                      >
                        {sub.name}
                      </NavDropdown.Item>
                    ))
                  ) : (
                    <NavDropdown.Item disabled>No subcategories</NavDropdown.Item>
                  )}
                </NavDropdown>
              ))
            ) : (
              <Nav.Link className="nav-link-custom" disabled>No categories</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

// import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
// import { useCart } from '../hooks/CartContext';
// import '../Style/Navbar.css';
// import { Link, useNavigate } from 'react-router-dom';

// export default function GetCategories_Navbar() {
//   const { categories = [], loading, error } = useCart();
//   const navigate = useNavigate();

//   if (loading) return <div>Loading categories...</div>;
//   if (error) return <div>Error loading categories.</div>;

//   return (
//     <Navbar expand="lg" className="bg-body-tertiary">
//       <div className='container'>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="me-auto">
//             <Nav.Link as={Link} to="/">Home</Nav.Link>
//             {categories.length > 0 ? (
//               categories.map((category) => (
//                 <NavDropdown 
//                   key={category.category_id} 
//                   title={category.category_name} 
//                   id={`category-dropdown-${category.category_id}`}
//                 >
//                   {/* Add a direct link to the category itself */}
//                   <NavDropdown.Item
//                     as={Link}
//                     to={`/subcategory/${category.category_id}`}
//                     onClick={() => navigate(`/category/${category.category_id}`)}
//                   >
//                     All {category.category_name}
//                   </NavDropdown.Item>

//                   {category.subcategories?.length > 0 ? (
//                     category.subcategories.map((sub) => (
//                       <NavDropdown.Item
//                         as={Link}
//                         to={`/subcategory/${sub.id}`}
//                         key={sub.id}
//                         className="category-link"
//                       >
//                         {sub.name}
//                       </NavDropdown.Item>
//                     ))
//                   ) : (
//                     <NavDropdown.Item disabled>No subcategories</NavDropdown.Item>
//                   )}
//                 </NavDropdown>
//               ))
//             ) : (
//               <Nav.Link disabled>No categories available</Nav.Link>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </div>
//     </Navbar>
//   );
// }