import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import { useFoodCart } from "../foodcontext/FoodCartContext";

const CheckoutPage = () => { 
  const navigate = useNavigate();

  // Use context to access cart items and total cost
  const { cartItems, totalCost, clearCart } = useFoodCart();

  // State to hold shipping details (name, address, phone)
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    phone: ""
  });

  // ⚠️ Adjust this based on how the user is stored in your auth system
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // Handle the form submission when placing an order
  const handleOrderSubmit = async () => {
    if (!userId) {
      alert("You need to login first");
      return;
    }

    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    const items = cartItems.map((item) => ({
      productId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const orderData = {
      userId,
      items,
      totalCost,
      shippingAddress,
      paymentMethod: "Cash on Delivery", // Fixed payment method
    };

    try {
      // Send the order data to the backend for processing
      await axios.post("http://localhost:5000/api/orders/checkout", orderData);

      alert("Order placed successfully!");
      clearCart(); // Clear the cart after order is placed
      navigate("/history"); // Redirect to order history page
    } catch (error) {
      console.error(error);
      alert("Order failed");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {/* Shipping Information Form */}
      <div className="shipping-info">
        <label>Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={shippingAddress.name}
          onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
          required
        />

        <label>Address</label>
        <input
          type="text"
          placeholder="Enter your address"
          value={shippingAddress.address}
          onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
          required
        />

        <label>Phone</label>
        <input
          type="text"
          placeholder="Enter your phone number"
          value={shippingAddress.phone}
          onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
          required
        />
      </div>

      {/* Display the cart items */}
      <div className="cart-summary">
        <h3>Cart Items</h3>
        <ul>
          {cartItems.map((item) => (
            <li key={item._id}>
              {item.name} - {item.quantity} x ${item.price}
            </li>
          ))}
        </ul>
        <h3>Total Cost: ${totalCost}</h3>
      </div>

      {/* Place Order Button */}
      <button onClick={handleOrderSubmit}>
        Place Order
      </button>
    </div>
  );
};

export default CheckoutPage;
