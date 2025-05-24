import { useState, useEffect } from "react";
import axios from "axios";

export default function ProductShow() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/product/api/product/v1");
        console.log(response.data)
        setProducts(response.data);
      } catch (err) {
        setError("Failed to fetch products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Product List</h2>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
     


      {/* Responsive Table */}
      {!loading && (
        <div className="table-responsive">  {/* Table wrapped in this div */}
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Price ($)</th>
                <th scope="col">Stock</th>
                <th scope="col">Category ID</th>
                <th scope="col">Subcategory ID</th>
                <th scope="col">MRSP</th>
                <th scope="col">Discount</th>
                <th scope="col">Old Price</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <img src={product.image_url} alt={product.name} style={{ width: "50px", height: "50px" }} />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.description.substring(0, 50)}...</td>
                    <td>${product.price}</td>
                    <td>{product.stock_quantity}</td>
                    <td>{product.category_name}</td>
                    <td>{product.subcategory_name}</td>
                    <td>${product.mrsp}</td>
                    <td>{product.discount}</td>
                    <td>${product.old_price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">No Products Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function ProductShow() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]); // Ensure categories is initialized as an array
//   const [subcategories, setSubcategories] = useState([]); // Ensure subcategories is initialized as an array
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch products
//         const productsResponse = await axios.get("http://127.0.0.1:5000/product/api/product/v1");
//         setProducts(productsResponse.data);

//         // Fetch categories
//         const categoriesResponse = await axios.get("http://127.0.0.1:5000/categories/api/category/v1");
//         if (Array.isArray(categoriesResponse.data.categories)) {
//           setCategories(categoriesResponse.data.categories); // Set the categories array
//         } else {
//           console.error("Categories data is not an array:", categoriesResponse.data);
//           setError("Invalid categories data received.");
//         }

//         // Fetch subcategories
//         const subcategoriesResponse = await axios.get("http://127.0.0.1:5000/categories/api/subcategory/v1");
//         if (Array.isArray(subcategoriesResponse.data)) {
//           setSubcategories(subcategoriesResponse.data); // Set the subcategories array
//         } else {
//           console.error("Subcategories data is not an array:", subcategoriesResponse.data);
//           setError("Invalid subcategories data received.");
//         }
//       } catch (err) {
//         setError("Failed to fetch data. Please try again.");
//         console.error("Error fetching data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Helper function to get category name by ID
//   const getCategoryName = (categoryId) => {
//     if (!Array.isArray(categories)) {
//       console.error("Categories is not an array:", categories);
//       return "Unknown Category";
//     }
//     const category = categories.find((cat) => cat.category_id === categoryId);
//     return category ? category.category_name : "Unknown Category";
//   };

//   // Helper function to get subcategory name by ID
//   const getSubcategoryName = (subcategoryId) => {
//     if (!Array.isArray(subcategories)) {
//       console.error("Subcategories is not an array:", subcategories);
//       return "Unknown Subcategory";
//     }
//     const subcategory = subcategories.find((subcat) => subcat.id === subcategoryId);
//     return subcategory ? subcategory.name : "Unknown Subcategory";
//   };

//   return (
//     <div className="container mt-4">
//       <h2 className="text-center mb-3">Product List</h2>

//       {/* Error Message */}
//       {error && (
//         <div className="alert alert-danger d-flex align-items-center" role="alert">
//           <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
//         </div>
//       )}

//       {/* Loading Spinner */}
//       {loading && (
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       )}

//       {/* Responsive Table */}
//       {!loading && (
//         <div className="table-responsive">
//           <table className="table table-bordered table-hover">
//             <thead className="table-dark">
//               <tr>
//                 <th scope="col">ID</th>
//                 <th scope="col">Image</th>
//                 <th scope="col">Name</th>
//                 <th scope="col">Description</th>
//                 <th scope="col">Price ($)</th>
//                 <th scope="col">Stock</th>
//                 <th scope="col">Category</th>
//                 <th scope="col">Subcategory</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.length > 0 ? (
//                 products.map((product) => (
//                   <tr key={product.id}>
//                     <td>{product.id}</td>
//                     <td>
//                       <img src={product.image_url} alt={product.name} style={{ width: "50px", height: "50px" }} />
//                     </td>
//                     <td>{product.name}</td>
//                     <td>{product.description.substring(0, 50)}...</td>
//                     <td>${product.price}</td>
//                     <td>{product.stock_quantity}</td>
//                     <td>{getCategoryName(product.category_id)}</td>
//                     <td>{getSubcategoryName(product.subcategory_id)}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="text-center">No Products Found</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }