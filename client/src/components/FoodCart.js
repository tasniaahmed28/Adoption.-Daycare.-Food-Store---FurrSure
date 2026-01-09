import React from "react";
import { useFoodCart } from "../foodcontext/FoodCartContext";

const FoodCart = () => {
  const { cartItems, increaseQty, decreaseQty, removeFromCart, totalCost } = useFoodCart();

  if (cartItems.length === 0) {
    return <h2 style={{ textAlign: "center", marginTop: 40 }}>Your cart is empty.</h2>;
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "30px 20px" }}>
      <h1 style={{ marginBottom: 20 }}>🛒 Food Cart</h1>

      {cartItems.map((item) => (
        <div
          key={item._id}
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            padding: 14,
            border: "1px solid #eee",
            borderRadius: 12,
            marginBottom: 12,
            background: "white",
          }}
        >
          <img
            src={item.imageUrl}
            alt={item.name}
            style={{ width: 90, height: 70, objectFit: "cover", borderRadius: 10 }}
          />

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>{item.name}</div>
            <div style={{ color: "#666", marginTop: 4 }}>${item.price}</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => decreaseQty(item._id)}>-</button>
            <span style={{ minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
            <button onClick={() => increaseQty(item._id)}>+</button>
          </div>

          <button onClick={() => removeFromCart(item._id)} style={{ marginLeft: 10 }}>
            Remove
          </button>
        </div>
      ))}

      <h2 style={{ textAlign: "right", marginTop: 20 }}>
        Total: ${totalCost.toFixed(2)}
      </h2>
    </div>
  );
};

export default FoodCart;
