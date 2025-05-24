import React, { useState, useEffect } from "react";
import { Container, Form, Button, Table, Alert } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function ProductDetails() {
    const [productDetails, setProductDetails] = useState([]);
    const [productId, setProductId] = useState("");
    const [attributeName, setAttributeName] = useState("");
    const [attributeValue, setAttributeValue] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [products, setProducts] = useState([]); // State to store products

    // Fetch all product details on component mount
    useEffect(() => {
        fetchProductDetails();
        fetchProducts(); // Fetch products for the dropdown
    }, []);

    // Fetch all product details
    const fetchProductDetails = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/product/api/productdetail/v1");
            setProductDetails(response.data);
            setError("");
        } catch (err) {
            setError("Failed to fetch product details.");
            console.error(err);
        }
    };

    // Fetch products for the dropdown
    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/product/api/product/v1");
            // console.log('talhahhaha',(response.data));
            setProducts(response.data); // Set the products state
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    // Fetch product details by product ID
    const fetchProductDetailsById = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/product/api/productdetail/v1/${id}`);
            setProductDetails(response.data);
            setError("");
        } catch (err) {
            setError("Failed to fetch product details for the given ID.");
            console.error(err);
        }
    };

    // Create a new product detail
    const createProductDetail = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:5000//product/api/productdetail/v1", {
                product_id: productId,
                attribute_name: attributeName,
                attribute_value: attributeValue,
            });
            setMessage(response.data.message);
            setError("");
            // Clear form fields
            setProductId("");
            setAttributeName("");
            setAttributeValue("");
            // Refresh product details
            fetchProductDetails();
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create product detail.");
            console.error(err);
        }
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Product Details Management</h1>

            {/* Display messages */}
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Form to create product details */}
            <Form onSubmit={createProductDetail} className="mb-5">
                <Form.Group controlId="productId" className="mb-3">
                    <Form.Label>Product</Form.Label>
                    <Form.Select
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        required
                    >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="attributeName" className="mb-3">
                    <Form.Label>Attribute Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Attribute Name"
                        value={attributeName}
                        onChange={(e) => setAttributeName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="attributeValue" className="mb-3">
                    <Form.Label>Attribute Value</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Attribute Value"
                        value={attributeValue}
                        onChange={(e) => setAttributeValue(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Create Product Detail
                </Button>
            </Form>

            {/* Fetch product details by ID */}
            <Form className="mb-5" onSubmit={(e) => {
                e.preventDefault();
                fetchProductDetailsById(productId);
            }}>
                <Form.Group controlId="fetchById" className="mb-3">
                    <Form.Label>Fetch Product Details by Product ID</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter Product ID"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="secondary" type="submit">
                    Fetch Details
                </Button>
            </Form>

            {/* Display product details in a table */}
            <h2 className="text-center mb-3">Product Details</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product ID</th>
                        <th>Attribute Name</th>
                        <th>Attribute Value</th>
                    </tr>
                </thead>
                <tbody>
                    {productDetails.map((detail) => (
                        <tr key={detail.id}>
                            <td>{detail.id}</td>
                            <td>{detail.product_id}</td>
                            <td>{detail.attribute_name}</td>
                            <td>{detail.attribute_value}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default ProductDetails;