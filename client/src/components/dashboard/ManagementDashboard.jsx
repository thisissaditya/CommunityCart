import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchProducts, fetchComplaints, createProductApi, updateComplaintStatusApi } from '../../services/api';
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  PlusCircle, 
  Store, 
  Users, 
  FileSpreadsheet, 
  Settings, 
  Check, 
  X,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export const ManagementDashboard = () => {
  const { currentUser, switchRole, selectedVillage, showToast } = useApp();

  // Active view inside dashboard: 'overview' | 'inventory' | 'complaints' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');

  // Vendor inventory state
  const [products, setProducts] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('food');
  const [newProdUnit, setNewProdUnit] = useState('1 plate / 1 item');
  const [newProdDescription, setNewProdDescription] = useState('');

  const isVendor = currentUser?.role === 'vendor';
  const isAdmin = currentUser?.role === 'admin';

  const loadData = async () => {
    const prods = await fetchProducts();
    const cmps = await fetchComplaints();
    setProducts(prods);
    setComplaints(cmps);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStock = (prodId) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === prodId ? { ...p, inStock: !p.inStock } : p))
    );
    showToast('Inventory stock status updated!');
  };

  const handleUpdateComplaintStatus = async (cmpId, newStatus) => {
    await updateComplaintStatusApi(cmpId, newStatus);
    setComplaints((prev) =>
      prev.map((c) => (c.id === cmpId ? { ...c, status: newStatus } : c))
    );
    showToast(`Grievance marked as ${newStatus}`);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) {
      showToast('Please enter item name and price', 'error');
      return;
    }

    const payload = {
      name: newProdName,
      price: Number(newProdPrice),
      originalPrice: Number(newProdPrice) + 15,
      category: newProdCategory,
      unit: newProdUnit,
      description: newProdDescription,
      storeName: currentUser?.storeName || 'Sharma Ji Ka Mess & Dhaba',
    };

    const res = await createProductApi(payload);
    if (res.success) {
      showToast(`Item "${newProdName}" added to digital catalogue!`);
      setShowAddProductModal(false);
      setNewProdName('');
      setNewProdPrice('');
      setNewProdDescription('');
      loadData();
    }
  };

  // Mock stats
  const totalRevenue = 14850;
  const activeOrdersCount = 18;
  const pendingComplaintsCount = complaints.filter((c) => c.status !== 'Resolved').length;
  const resolvedRate = complaints.length > 0
    ? Math.round((complaints.filter((c) => c.status === 'Resolved').length / complaints.length) * 100)
    : 100;

  return (
    <div className="dashboard-container">
      {/* Sidebar (Dribbble Dashboard style) */}
      <aside className="dashboard-sidebar">
        <div style={{ padding: '0.5rem 0.5rem 1rem 0.5rem', borderBottom: '1px solid var(--slate-100)', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--slate-400)', textTransform: 'uppercase' }}>
            Active Portal
          </div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--slate-900)' }}>
            {isAdmin ? '🏛️ Panchayat Admin' : '🏪 Vendor Command'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.1rem' }}>
            {currentUser?.storeName || selectedVillage}
          </div>
        </div>

        <button 
          className={`sidebar-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp size={18} />
          Executive Overview
        </button>

        <button 
          className={`sidebar-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <Package size={18} />
          Digital Catalogue
        </button>

        <button 
          className={`sidebar-tab-btn ${activeTab === 'complaints' ? 'active' : ''}`}
          onClick={() => setActiveTab('complaints')}
        >
          <AlertTriangle size={18} />
          Civic Oversight
        </button>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--slate-100)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
            Role View Preview
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexDirection: 'column' }}>
            <button
              className="btn-secondary"
              style={{ width: '100%', fontSize: '0.78rem', padding: '0.4rem', justifyContent: 'flex-start' }}
              onClick={() => switchRole('vendor')}
            >
              <Store size={14} /> Shop Owner Mode
            </button>
            <button
              className="btn-secondary"
              style={{ width: '100%', fontSize: '0.78rem', padding: '0.4rem', justifyContent: 'flex-start' }}
              onClick={() => switchRole('admin')}
            >
              <Users size={14} /> Panchayat Admin Mode
            </button>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Panel */}
      <main className="dashboard-main">
        {/* Header banner */}
        <div className="dashboard-header-card">
          <div>
            <div style={{ fontSize: '0.8rem', color: '#fed7aa', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              Real-Time Community Operations
            </div>
            <h2 style={{ fontSize: '1.75rem', color: '#ffffff' }}>
              Welcome back, {currentUser?.name}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.3rem' }}>
              Monitoring orders, catalogue availability, and civic grievances for <strong>{selectedVillage}</strong>.
            </p>
          </div>

          <button 
            className="btn-primary" 
            style={{ background: '#ffffff', color: 'var(--slate-900)' }}
            onClick={() => setShowAddProductModal(true)}
          >
            <PlusCircle size={17} color="var(--primary)" />
            Add Catalogue Item
          </button>
        </div>

        {/* Bento Stat Cards Grid (Dribbble Inspired) */}
        <div className="stats-grid-4">
          <div className="stat-card-bento">
            <div className="stat-header">
              <span className="stat-lbl">Today's Village Sales</span>
              <div className="stat-icon-wrap" style={{ background: '#fff7ed', color: '#ea580c' }}>
                <ShoppingBag size={20} />
              </div>
            </div>
            <div className="stat-val">₹{totalRevenue.toLocaleString()}</div>
            <div className="stat-trend positive">
              <TrendingUp size={13} />
              <span>+24% from yesterday</span>
            </div>
          </div>

          <div className="stat-card-bento">
            <div className="stat-header">
              <span className="stat-lbl">Active Daily Orders</span>
              <div className="stat-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
                <Clock size={20} />
              </div>
            </div>
            <div className="stat-val">{activeOrdersCount}</div>
            <div className="stat-trend positive">
              <span>9 Out for Delivery</span>
            </div>
          </div>

          <div className="stat-card-bento">
            <div className="stat-header">
              <span className="stat-lbl">Active Civic Issues</span>
              <div className="stat-icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
                <AlertTriangle size={20} />
              </div>
            </div>
            <div className="stat-val">{pendingComplaintsCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 600 }}>
              Under review by Lineman & PHC
            </div>
          </div>

          <div className="stat-card-bento">
            <div className="stat-header">
              <span className="stat-lbl">Resolution Rate</span>
              <div className="stat-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <CheckCircle2 size={20} />
              </div>
            </div>
            <div className="stat-val">{resolvedRate}%</div>
            <div className="stat-trend positive">
              <span>Excellent community rating</span>
            </div>
          </div>
        </div>

        {/* Digital Catalogue / Inventory Table */}
        {(activeTab === 'overview' || activeTab === 'inventory') && (
          <div className="data-table-card">
            <div className="table-header-row">
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>Store Product Inventory & Stock Control</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                  Manage item availability to prevent cancellations during rush hours
                </p>
              </div>
              <button 
                className="btn-primary" 
                style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}
                onClick={() => setShowAddProductModal(true)}
              >
                <PlusCircle size={15} /> Add Item
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Item Details</th>
                    <th>Category</th>
                    <th>Selling Price</th>
                    <th>Package Unit</th>
                    <th>Stock Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 6).map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }} 
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{p.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{p.storeName}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{p.category}</span>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--slate-900)' }}>₹{p.price}</strong>
                      </td>
                      <td>{p.unit}</td>
                      <td>
                        {p.inStock ? (
                          <span className="status-badge resolved">In Stock</span>
                        ) : (
                          <span className="status-badge critical">Out of Stock</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn-secondary"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                          onClick={() => handleToggleStock(p.id)}
                        >
                          {p.inStock ? 'Mark Sold Out' : 'Mark Available'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Civic Grievance Oversight Table */}
        {(activeTab === 'overview' || activeTab === 'complaints') && (
          <div className="data-table-card">
            <div className="table-header-row">
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>Village Grievance & Complaint Tracking</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                  Panchayat officer assigned updates and real-time public status toggling
                </p>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Grievance Subject</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Priority</th>
                    <th>Current Status</th>
                    <th>Resolution Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{c.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>By {c.citizenName}</div>
                      </td>
                      <td>{c.category}</td>
                      <td>{c.location}</td>
                      <td>
                        <span style={{ 
                          fontWeight: 700, 
                          color: c.priority === 'Critical' ? 'var(--emergency)' : 'inherit' 
                        }}>
                          {c.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${c.status.toLowerCase().replace(' ', '-')}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          {c.status !== 'Resolved' && (
                            <button
                              className="btn-secondary"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: 'var(--emerald-700)' }}
                              onClick={() => handleUpdateComplaintStatus(c.id, 'Resolved')}
                              title="Mark as Resolved"
                            >
                              <Check size={13} /> Resolve
                            </button>
                          )}
                          {c.status === 'Pending' && (
                            <button
                              className="btn-secondary"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: 'var(--info)' }}
                              onClick={() => handleUpdateComplaintStatus(c.id, 'In Progress')}
                              title="Mark In Progress"
                            >
                              <Clock size={13} /> In Progress
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="modal-overlay" onClick={() => setShowAddProductModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>Add Item to Catalogue</h3>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Publish a new mess meal, fresh crop, or grocery product to your digital shopfront.
            </p>

            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.3rem' }}>
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Desi Paneer 500g or Pure Wheat Atta"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.3rem' }}>
                    Category *
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--slate-300)',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="food">🍲 Food & Mess</option>
                    <option value="grocery">🥦 Kirana & Produce</option>
                    <option value="pharmacy">💊 Pharmacy / Health</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.3rem' }}>
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="80"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--slate-300)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.3rem' }}>
                  Package / Serving Unit
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1 kg bag / 2 pcs / 1 Thali"
                  value={newProdUnit}
                  onChange={(e) => setNewProdUnit(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.3rem' }}>
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Freshly prepared, zero chemical preservatives, etc."
                  value={newProdDescription}
                  onChange={(e) => setNewProdDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowAddProductModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
