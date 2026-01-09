import React, { useEffect, useState } from "react";
import "./ProductStore.css";
import { useFoodCart } from "../foodcontext/FoodCartContext";
import { Link } from "react-router-dom";  // ✅ added Link

const ProductStore = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  const { addToCart, cartItems } = useFoodCart(); // ✅ include cartItems

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const url =
          category === "all"
            ? "http://localhost:5000/api/foods"
            : `http://localhost:5000/api/foods?category=${category}`;

        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching food data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [category]);

  return ( 
    <div className="product-store">
      <div className="store-header">
        <h1>🛍️ Fursure Pet Store</h1>
        <p>Everything your pet needs, delivered with love</p>

        {/* Cart link (do NOT type URL manually) */}
        <div style={{ marginTop: 12 }}>
          <Link to="/foodcart" style={{ textDecoration: "none", fontWeight: 700 }}>
            🛒 View Cart ({cartItems.length})
          </Link>
        </div>

        <div style={{ marginTop: "20px" }}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            <option value="all">All</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="fish">Fish</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {loading ? (
        <h2 style={{ textAlign: "center" }}>Loading foods...</h2>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
              />

              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>

                <div className="product-footer">
                  <span className="product-price">${product.price}</span>

                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                  {/* Link to Product Details Page */}
                  <Link to={`/food-details/${product._id}`}>
                    <button className="view-details-btn">View Details</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>
              No items found in this category.
            </p>
          )}
        </div>
      )}
      {/* Checkout Button - Only visible if there are items in the cart */}
      {cartItems.length > 0 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Link to="/checkout">
            <button className="checkout-button">
              Go to Checkout ({cartItems.length} items)
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductStore;