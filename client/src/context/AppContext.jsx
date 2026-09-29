import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication & Role
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('communitycart_user');
    return saved
      ? JSON.parse(saved)
      : {
          id: 'user-demo',
          name: 'Aditya Rakesh',
          email: 'aditya@example.com',
          role: 'citizen', // 'citizen' | 'vendor' | 'admin'
          village: 'Rampur Panchayat',
        };
  });

  // Location / Panchayat
  const [selectedVillage, setSelectedVillage] = useState('Rampur Panchayat');

  // Navigation tab: 'marketplace' | 'complaints' | 'events' | 'dashboard'
  const [activeTab, setActiveTab] = useState('marketplace');

  // Marketplace filters
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'food' | 'grocery' | 'pharmacy'
  const [searchQuery, setSearchQuery] = useState('');

  // Cart state
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('communitycart_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('communitycart_cart', JSON.stringify(cart));
  }, [cart]);

  // Modals
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const switchRole = (newRole) => {
    const updated = {
      ...currentUser,
      role: newRole,
      storeName: newRole === 'vendor' ? 'Sharma Ji Ka Mess & Dhaba' : null,
    };
    setCurrentUser(updated);
    localStorage.setItem('communitycart_user', JSON.stringify(updated));
    showToast(`Switched active view to ${newRole.toUpperCase()} mode`, 'info');
  };

  const loginUser = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('communitycart_user', JSON.stringify(userData));
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${userData.name}!`);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('communitycart_user');
    showToast('Logged out successfully');
  };

  // Cart operations
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        loginUser,
        logoutUser,
        selectedVillage,
        setSelectedVillage,
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
