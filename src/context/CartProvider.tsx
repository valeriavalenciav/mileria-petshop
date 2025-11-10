
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of a cart item and the context
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
}

// Create the context with a default undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem('shoppingCart');
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
      setItems([]);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('shoppingCart', JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [items]);

  const addItem = (itemToAdd: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemToAdd.id);
      if (existingItem) {
        // If item exists, just increase quantity
        return prevItems.map(item =>
          item.id === itemToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // If item doesn't exist, add it to the cart with quantity 1
      return [...prevItems, { ...itemToAdd, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      setItems(prevItems =>
        prevItems.map(item => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    totalAmount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
