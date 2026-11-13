// API service for CommunityCart with resilient fallback support
const API_BASE = '/api';

export const fetchStores = async (category = 'all', village = '') => {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (village) params.append('village', village);
    
    const res = await fetch(`${API_BASE}/stores?${params.toString()}`);
    if (!res.ok) throw new Error('Network response not ok');
    const data = await res.json();
    return (data.stores || []).map(store => ({ ...store, id: store._id || store.id }));
  } catch (err) {
    console.warn('Backend API fallback for stores:', err);
    return [];
  }
};

export const fetchSearchSuggestionsApi = async (query = '') => {
  try {
    const params = new URLSearchParams();
    if (query) params.append('q', query);

    const res = await fetch(`${API_BASE}/stores/search/suggestions?${params.toString()}`);
    if (!res.ok) throw new Error('Network response not ok');
    return await res.json();
  } catch (err) {
    console.warn('Backend API fallback for search suggestions:', err);
    return {
      success: true,
      popularSearches: [
        'Shudh Ghee Thali',
        'Paneer Butter Masala',
        'Dal Makhani',
        'Khasta Samosa',
        'Desi Ghee Jalebi',
        'Chakki Atta',
        'Paracetamol 650mg',
        'Kulhad Chai',
      ],
      suggestions: [],
      products: [],
      stores: [],
    };
  }
};

export const fetchProducts = async (category = 'all', search = '') => {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/stores/products?${params.toString()}`);
    if (!res.ok) throw new Error('Network response not ok');
    const data = await res.json();
    return (data.products || []).map(product => ({ ...product, id: product._id || product.id }));
  } catch (err) {
    console.warn('Backend API fallback for products:', err);
    return [];
  }
};

export const fetchComplaints = async (status = 'All', category = 'All') => {
  try {
    const params = new URLSearchParams();
    if (status && status !== 'All') params.append('status', status);
    if (category && category !== 'All') params.append('category', category);

    const res = await fetch(`${API_BASE}/complaints?${params.toString()}`);
    if (!res.ok) throw new Error('Network response not ok');
    const data = await res.json();
    return data.complaints || [];
  } catch (err) {
    console.warn('Backend API fallback for complaints:', err);
    return [];
  }
};

export const postComplaint = async (complaintData) => {
  try {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaintData),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const updateComplaintStatusApi = async (id, status) => {
  try {
    const res = await fetch(`${API_BASE}/complaints/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const fetchEvents = async () => {
  try {
    const res = await fetch(`${API_BASE}/events`);
    if (!res.ok) throw new Error('Network response not ok');
    const data = await res.json();
    return data.events || [];
  } catch (err) {
    console.warn('Backend API fallback for events:', err);
    return [];
  }
};

export const fetchEmergencyContacts = async () => {
  try {
    const res = await fetch(`${API_BASE}/emergency`);
    if (!res.ok) throw new Error('Network response not ok');
    const data = await res.json();
    return data.contacts || [];
  } catch (err) {
    console.warn('Backend API fallback for emergency contacts:', err);
    return [];
  }
};

export const triggerSOSApi = async (sosData) => {
  try {
    const res = await fetch(`${API_BASE}/emergency/sos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sosData),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const loginApi = async (credentials) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const registerApi = async (userData) => {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const createProductApi = async (productData) => {
  try {
    const res = await fetch(`${API_BASE}/stores/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const bulkImportProductsApi = async (products) => {
  try {
    const res = await fetch(`${API_BASE}/stores/products/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const toggleProductStockApi = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/stores/products/${id}/toggle-stock`, {
      method: 'PATCH',
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const createOrderApi = async (orderData) => {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const fetchUserOrdersApi = async (email) => {
  try {
    const res = await fetch(`${API_BASE}/orders/user/${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error('Failed to fetch user orders');
    const data = await res.json();
    return (data.orders || []).map(o => ({ ...o, id: o._id || o.id }));
  } catch (err) {
    console.warn('Backend API fallback for user orders:', err);
    return [];
  }
};

export const fetchVendorOrdersApi = async (storeName = 'all') => {
  try {
    const res = await fetch(`${API_BASE}/orders/vendor/${encodeURIComponent(storeName)}`);
    if (!res.ok) throw new Error('Failed to fetch vendor orders');
    const data = await res.json();
    return (data.orders || []).map(o => ({ ...o, id: o._id || o.id }));
  } catch (err) {
    console.warn('Backend API fallback for vendor orders:', err);
    return [];
  }
};

export const fetchAllOrdersApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error('Failed to fetch all orders');
    const data = await res.json();
    return (data.orders || []).map(o => ({ ...o, id: o._id || o.id }));
  } catch (err) {
    console.warn('Backend API fallback for all orders:', err);
    return [];
  }
};

export const updateOrderStatusApi = async (id, status, note = '', riderName = 'Raju') => {
  try {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note, riderName }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};
