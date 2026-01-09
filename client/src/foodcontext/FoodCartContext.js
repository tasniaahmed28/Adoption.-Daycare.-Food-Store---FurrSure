import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

const FoodCartContext = createContext({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  decreaseQty: () => {},
  increaseQty: () => {},
  clearCart: () => {},
  totalCost: 0,
  cartCount: 0,
});

export const FoodCartProvider = ({ children }) => {
  // Load cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("foodCart");
    return saved ? JSON.parse(saved) : [];
  });

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("foodCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) {
        return prev.map((p) =>
          p._id === product._id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((p) => p._id !== id));
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((p) =>
          p._id === id ? { ...p, quantity: p.quantity - 1 } : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, quantity: p.quantity + 1 } : p
      )
    );
  };

  // ✅ Clear cart after checkout
  const clearCart = () => {
    setCartItems([]);
  };

  // ✅ Total price
  const totalCost = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  // ✅ Total items count (for cart badge)
  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    decreaseQty,
    increaseQty,
    clearCart,
    totalCost,
    cartCount,
  };

  return (
    <FoodCartContext.Provider value={value}>
      {children}
    </FoodCartContext.Provider>
  );
};

export const useFoodCart = () => useContext(FoodCartContext);
