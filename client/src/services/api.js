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
    return data.stores || [];
  } catch (err) {
    console.warn('Backend API fallback for stores:', err);
    return [];
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
    return data.products || [];
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
