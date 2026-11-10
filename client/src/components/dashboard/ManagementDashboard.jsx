import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  fetchProducts, 
  fetchComplaints, 
  createProductApi, 
  bulkImportProductsApi,
  fetchAllOrdersApi,
  updateOrderStatusApi,
  updateComplaintStatusApi,
  toggleProductStockApi 
} from '../../services/api';
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
  ToggleRight,
  Truck,
  UploadCloud,
  Download,
  Sparkles,
  ChefHat,
  MessageSquare,
  MapPin,
  Phone
} from 'lucide-react';

const DHABA_PRESETS = [
  {
    title: '🍲 Dhaba Curries & Paneer Specials',
    description: 'Slow-cooked village dal makhani, paneer butter masala, dal tadka, kadhai paneer, and veg thali.',
    count: 5,
    items: [
      {
        name: 'Paneer Butter Masala (Dhaba Special)',
        category: 'food',
        subcategory: 'Main Course',
        price: 150,
        originalPrice: 180,
        unit: '1 Plate (350g)',
        description: 'Tender cottage cheese cubes simmered in a velvety buttery tomato sauce spiked with crushed kasuri methi.',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        isVeg: true,
      },
      {
        name: 'Slow Cooked Dal Makhani',
        category: 'food',
        subcategory: 'Main Course',
        price: 120,
        originalPrice: 140,
        unit: '1 Handi (Serves 2)',
        description: 'Whole black lentils & kidney beans slow-cooked overnight on gentle embers with village butter and fresh cream.',
        image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        isVeg: true,
      },
      {
        name: 'Dhaba Style Tadka Dal',
        category: 'food',
        subcategory: 'Main Course',
        price: 85,
        originalPrice: 100,
        unit: '1 Bowl',
        description: 'Charcoal-smoked toor and chana dal tempered in pure ghee with whole red chillies and caramelized onions.',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        isVeg: true,
      },
      {
        name: 'Desi Shudh Ghee Special Thali',
        category: 'food',
        subcategory: 'Full Meal',
        price: 90,
        originalPrice: 110,
        unit: '1 Platter',
        description: 'Wholesome village thali with pure desi ghee, dal tadka, aloo gobhi sabzi, 4 rotis, and rice.',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        isVeg: true,
      },
      {
        name: 'Kadhai Paneer Dhaba Style',
        category: 'food',
        subcategory: 'Main Course',
        price: 140,
        originalPrice: 170,
        unit: '1 Plate (300g)',
        description: 'Paneer tossed with fresh bell peppers, onions, and freshly ground coriander-chili spice blend.',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        isVeg: true,
      }
    ]
  },
  {
    title: '🫓 Tandoor Breads & Parathas',
    description: 'Butter tandoori roti, garlic naan, laccha paratha, and spicy aloo pyaz stuffed parathas.',
    count: 4,
    items: [
      {
        name: 'Butter Tandoori Roti Basket (4 Pcs)',
        category: 'food',
        subcategory: 'Breads',
        price: 35,
        originalPrice: 40,
        unit: '4 Pieces',
        description: 'Clay tandoor baked wheat rotis brushed with golden farm butter.',
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        isVeg: true,
      },
      {
        name: 'Garlic Butter Naan (2 Pcs)',
        category: 'food',
        subcategory: 'Breads',
        price: 60,
        originalPrice: 75,
        unit: '2 Pieces',
        description: 'Clay oven flatbread sprinkled with minced roasted garlic and fresh coriander.',
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        isVeg: true,
      },
      {
        name: 'Amritsari Aloo Pyaaz Paratha with White Makhan',
        category: 'food',
        subcategory: 'Breads & Breakfast',
        price: 55,
        originalPrice: 70,
        unit: '1 Large Paratha',
        description: 'Crisp whole-wheat stuffed flatbread served with homemade white butter and pickle.',
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        isVeg: true,
      },
      {
        name: 'Village Missi Roti with White Butter (2 Pcs)',
        category: 'food',
        subcategory: 'Breads',
        price: 45,
        originalPrice: 50,
        unit: '2 Pieces',
        description: 'Nutritious gram flour and wheat bread flavored with ajwain and topped with chulha butter.',
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        isVeg: true,
      }
    ]
  },
  {
    title: '🥟 Halwai Morning Snacks & Sweets',
    description: 'Crispy samosas, desi ghee jalebis, chole bhature, gulab jamuns, and ginger kulhad chai.',
    count: 4,
    items: [
      {
        name: 'Village Crisp Samosa Plate (2 Pcs)',
        category: 'food',
        subcategory: 'Snacks',
        price: 25,
        originalPrice: 30,
        unit: '2 Pcs with Chutney',
        description: 'Golden flaky triangular pastry filled with seasoned green peas and spiced potatoes.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        isVeg: true,
      },
      {
        name: 'Desi Ghee Hot Jalebi (250g)',
        category: 'food',
        subcategory: 'Mithai & Sweets',
        price: 65,
        originalPrice: 80,
        unit: '250g pack',
        description: 'Crisp spiral rings fried in pure cow ghee and soaked in saffron sugar syrup.',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        isVeg: true,
      },
      {
        name: 'Special Chole Bhature Platter',
        category: 'food',
        subcategory: 'Breakfast & Meals',
        price: 80,
        originalPrice: 95,
        unit: '2 Bhature + Pindi Chole',
        description: 'Two piping hot puffed bhaturas served with robust spicy chickpeas and pickle.',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        isVeg: true,
      },
      {
        name: 'Kulhad Ginger Masala Chai',
        category: 'food',
        subcategory: 'Beverages',
        price: 15,
        originalPrice: 20,
        unit: '1 Earthen Kulhad (150ml)',
        description: 'Boiled rich milk tea infused with freshly crushed ginger, cloves, and cardamom.',
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        isVeg: true,
      }
    ]
  }
];

export const ManagementDashboard = () => {
  const { currentUser, switchRole, selectedVillage, showToast, triggerSmsAlert, orderRefreshKey, refreshOrders } = useApp();

  // Active view inside dashboard: 'overview' | 'orders' | 'inventory' | 'complaints'
  const [activeTab, setActiveTab] = useState('overview');

  // State
  const [products, setProducts] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);

  // Single Product Form
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('food');
  const [newProdUnit, setNewProdUnit] = useState('1 plate / 1 item');
  const [newProdDescription, setNewProdDescription] = useState('');

  // Bulk CSV Text
  const [csvText, setCsvText] = useState('');

  const isVendor = currentUser?.role === 'vendor';
  const isAdmin = currentUser?.role === 'admin';

  const loadData = async () => {
    setLoading(true);
    const [prods, cmps, ords] = await Promise.all([
      fetchProducts(),
      fetchComplaints(),
      fetchAllOrdersApi(),
    ]);
    setProducts(prods);
    setComplaints(cmps);
    setOrders(ords);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [currentUser, orderRefreshKey]);

  const handleToggleStock = async (prodId) => {
    await toggleProductStockApi(prodId);
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

    // Send Simulated SMS to Citizen who registered grievance
    const cmp = complaints.find(c => c.id === cmpId);
    if (cmp) {
      triggerSmsAlert({
        phone: cmp.citizenPhone || '+91 94110 99887',
        title: 'Civic Grievance Status Update',
        message: `Your grievance regarding "${cmp.title}" is now marked as "${newStatus}" by Gram Panchayat.`,
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const res = await updateOrderStatusApi(orderId, newStatus, `Vendor updated status to ${newStatus}`, 'Raju Rider');
    if (res.success && res.order) {
      setOrders(prev => prev.map(o => (o.id === orderId ? { ...res.order, id: res.order._id || res.order.id } : o)));
      refreshOrders();
      showToast(`Order status updated to "${newStatus}"!`);

      // Send SMS alert simulation
      triggerSmsAlert({
        phone: res.order.customer?.phone || '+91 98765 43210',
        title: `Order Status: ${newStatus}`,
        message: res.order.smsNotification?.lastMessage || `Order status updated to ${newStatus}`,
      });
    } else {
      showToast('Failed to update order status', 'error');
    }
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

  const handleApplyPreset = async (preset) => {
    const storeName = currentUser?.storeName || 'Sharma Ji Ka Mess & Dhaba';
    const itemsToImport = preset.items.map(it => ({
      ...it,
      storeName,
    }));

    const res = await bulkImportProductsApi(itemsToImport);
    if (res.success) {
      showToast(`✅ Successfully imported ${preset.count} items from ${preset.title}!`);
      setShowBulkImportModal(false);
      loadData();
    } else {
      showToast('Failed to import preset', 'error');
    }
  };

  const handleImportCsv = async () => {
    if (!csvText.trim()) {
      showToast('Please paste CSV data', 'error');
      return;
    }

    const lines = csvText.trim().split('\n');
    const importedItems = [];
    const storeName = currentUser?.storeName || 'Sharma Ji Ka Mess & Dhaba';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || (i === 0 && line.toLowerCase().includes('name,price'))) continue;

      const [name, price, category, unit, description] = line.split(',').map(s => s?.trim());
      if (name && price) {
        importedItems.push({
          name,
          price: Number(price),
          originalPrice: Number(price) + 15,
          category: category || 'food',
          unit: unit || '1 item',
          description: description || 'Local village shop special',
          storeName,
          inStock: true,
          isVeg: true,
          image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80'
        });
      }
    }

    if (importedItems.length === 0) {
      showToast('No valid rows found in CSV', 'error');
      return;
    }

    const res = await bulkImportProductsApi(importedItems);
    if (res.success) {
      showToast(`🎉 Bulk imported ${importedItems.length} products successfully!`);
      setCsvText('');
      setShowBulkImportModal(false);
      loadData();
    } else {
      showToast('Failed to import CSV data', 'error');
    }
  };

  // Calculations for stats
  const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingComplaintsCount = complaints.filter((c) => c.status !== 'Resolved').length;
  const resolvedRate = complaints.length > 0
    ? Math.round((complaints.filter((c) => c.status === 'Resolved').length / complaints.length) * 100)
    : 100;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
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
          className={`sidebar-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
          style={{ position: 'relative' }}
        >
          <Truck size={18} />
          <span>Active Orders Pipeline</span>
          {activeOrders.length > 0 && (
            <span style={{
              marginLeft: 'auto',
              background: 'var(--primary)',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '0.15rem 0.45rem',
              borderRadius: '10px'
            }}>
              {activeOrders.length}
            </span>
          )}
        </button>

        <button 
          className={`sidebar-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <Package size={18} />
          Digital Catalogue ({products.length})
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
              Real-Time Community Operations (Phase 3 Logistics)
            </div>
            <h2 style={{ fontSize: '1.75rem', color: '#ffffff' }}>
              Welcome back, {currentUser?.name}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.3rem' }}>
              Monitoring orders, catalogue availability, and civic grievances for <strong>{selectedVillage}</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button 
              className="btn-secondary" 
              style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.25)' }}
              onClick={() => setShowBulkImportModal(true)}
            >
              <Sparkles size={16} />
              Bulk Import Dhaba Menu
            </button>
            <button 
              className="btn-primary" 
              style={{ background: '#ffffff', color: 'var(--slate-900)' }}
              onClick={() => setShowAddProductModal(true)}
            >
              <PlusCircle size={17} color="var(--primary)" />
              Add Single Item
            </button>
          </div>
        </div>

        {/* Bento Stat Cards Grid */}
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
              <span>{orders.length} Total Platform Orders</span>
            </div>
          </div>

          <div className="stat-card-bento">
            <div className="stat-header">
              <span className="stat-lbl">Active Delivery Pipeline</span>
              <div className="stat-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
                <Truck size={20} />
              </div>
            </div>
            <div className="stat-val">{activeOrders.length}</div>
            <div className="stat-trend positive">
              <span>{orders.filter(o => o.status === 'Out for Delivery').length} Out on Transit</span>
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
              <span>High civic satisfaction</span>
            </div>
          </div>
        </div>

        {/* TAB 1: ACTIVE ORDERS PIPELINE */}
        {(activeTab === 'overview' || activeTab === 'orders') && (
          <div className="data-table-card" style={{ marginBottom: '2rem' }}>
            <div className="table-header-row">
              <div>
                <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Truck size={20} color="var(--primary)" />
                  Vendor Active Orders Pipeline & Dispatch
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                  Accept incoming village orders, dispatch bicycle riders, and simulate SMS alerts
                </p>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-600)' }}>
                {activeOrders.length} in progress
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
              {orders.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-400)' }}>
                  No orders placed yet.
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      background: 'var(--slate-50)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--slate-200)',
                      padding: '1.15rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          background: '#0f172a',
                          color: '#ffffff',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px'
                        }}>
                          {ord.orderNumber}
                        </span>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--slate-900)' }}>
                          {ord.customer?.name}
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>
                          • {ord.storeName}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '14px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          background: ord.status === 'Delivered' 
                            ? 'var(--emerald-100)' 
                            : ord.status === 'Out for Delivery' 
                            ? '#ede9fe' 
                            : 'var(--amber-100)',
                          color: ord.status === 'Delivered' 
                            ? 'var(--emerald-800)' 
                            : ord.status === 'Out for Delivery' 
                            ? '#6d28d9' 
                            : 'var(--amber-800)'
                        }}>
                          ● {ord.status}
                        </span>
                        <strong style={{ fontSize: '1rem' }}>₹{ord.totalAmount}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.84rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-600)' }}>
                        <MapPin size={14} color="var(--primary)" />
                        <span>{ord.customer?.address}, {ord.customer?.village}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-500)' }}>
                        <Phone size={13} />
                        <span>{ord.customer?.phone} ({ord.paymentMethod})</span>
                      </div>
                    </div>

                    {/* Items pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {ord.items?.map((it, i) => (
                        <span 
                          key={i}
                          style={{
                            background: '#ffffff',
                            border: '1px solid var(--slate-200)',
                            borderRadius: '6px',
                            padding: '0.25rem 0.55rem',
                            fontSize: '0.78rem',
                            color: 'var(--slate-700)'
                          }}
                        >
                          {it.quantity}x {it.name} (₹{it.price * it.quantity})
                        </span>
                      ))}
                    </div>

                    {/* Action Pipeline Buttons for Vendor */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      paddingTop: '0.6rem',
                      borderTop: '1px solid var(--slate-200)',
                      marginTop: '0.25rem'
                    }}>
                      <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)' }}>
                        SMS Sent: <em>"{ord.smsNotification?.lastMessage || 'Notification dispatched.'}"</em>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {ord.status === 'Placed' && (
                          <button
                            className="btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                            onClick={() => handleUpdateOrderStatus(ord.id, 'Accepted')}
                          >
                            <Check size={13} /> Accept Order
                          </button>
                        )}
                        {ord.status === 'Accepted' && (
                          <button
                            className="btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', background: '#0284c7' }}
                            onClick={() => handleUpdateOrderStatus(ord.id, 'Preparing')}
                          >
                            <ChefHat size={13} /> Start Cooking & Packing
                          </button>
                        )}
                        {ord.status === 'Preparing' && (
                          <button
                            className="btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', background: '#7c3aed' }}
                            onClick={() => handleUpdateOrderStatus(ord.id, 'Out for Delivery')}
                          >
                            <Truck size={13} /> Dispatch / Out for Delivery
                          </button>
                        )}
                        {ord.status === 'Out for Delivery' && (
                          <button
                            className="btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', background: 'var(--emerald-600)' }}
                            onClick={() => handleUpdateOrderStatus(ord.id, 'Delivered')}
                          >
                            <CheckCircle2 size={13} /> Mark Delivered & Collected
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: DIGITAL CATALOGUE & INVENTORY */}
        {(activeTab === 'overview' || activeTab === 'inventory') && (
          <div className="data-table-card" style={{ marginBottom: '2rem' }}>
            <div className="table-header-row">
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>Store Product Inventory & Stock Control</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                  Manage item availability to prevent cancellations during rush hours
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.825rem' }}
                  onClick={() => setShowBulkImportModal(true)}
                >
                  <Sparkles size={14} /> Bulk Dhaba Presets
                </button>
                <button 
                  className="btn-primary" 
                  style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}
                  onClick={() => setShowAddProductModal(true)}
                >
                  <PlusCircle size={15} /> Add Item
                </button>
              </div>
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
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img 
                            src={p.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=100'} 
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

        {/* TAB 3: CIVIC GRIEVANCES */}
        {(activeTab === 'overview' || activeTab === 'complaints') && (
          <div className="data-table-card">
            <div className="table-header-row">
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>Village Grievance & Complaint Tracking</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                  Panchayat officer assigned updates and real-time public status toggling with simulated SMS
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
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>By {c.citizenName} ({c.citizenPhone})</div>
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
                        <span className={`status-badge ${c.status?.toLowerCase().replace(' ', '-')}`}>
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
                              title="Mark as Resolved and dispatch SMS"
                            >
                              <Check size={13} /> Resolve
                            </button>
                          )}
                          {c.status === 'Pending' && (
                            <button
                              className="btn-secondary"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: 'var(--info)' }}
                              onClick={() => handleUpdateComplaintStatus(c.id, 'In Progress')}
                              title="Mark In Progress and dispatch SMS"
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

      {/* BULK IMPORT DHABA PRESETS MODAL */}
      {showBulkImportModal && (
        <div className="modal-overlay" onClick={() => setShowBulkImportModal(false)}>
          <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.3rem' }}>Bulk Dhaba & Inventory Importer</h3>
              </div>
              <button className="modal-close-btn" style={{ position: 'static' }} onClick={() => setShowBulkImportModal(false)}>
                <X size={16} />
              </button>
            </div>

            <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Instantly populate your store with authentic Indian Dhaba menus or paste your own CSV spreadsheet.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--slate-400)', textTransform: 'uppercase' }}>
                Option 1: One-Click Popular Indian Dhaba Packs
              </div>

              {DHABA_PRESETS.map((preset, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: 'var(--slate-50)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-200)',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--slate-900)' }}>{preset.title}</strong>
                    <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
                      {preset.description} ({preset.count} items)
                    </p>
                  </div>

                  <button
                    className="btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', whiteSpace: 'nowrap' }}
                    onClick={() => handleApplyPreset(preset)}
                  >
                    1-Click Import
                  </button>
                </div>
              ))}
            </div>

            {/* Option 2: CSV Upload or Paste */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Option 2: Paste CSV Spreadsheet Text
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginBottom: '0.4rem' }}>
                Format: <code>Name, Price, Category, Unit, Description</code>
              </div>
              <textarea
                rows={3}
                placeholder="Kadai Paneer, 140, food, 1 plate, Spicy rich gravy&#10;Lassi Kulhad, 40, food, 1 glass, Thick sweet malai lassi"
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--slate-300)',
                  fontSize: '0.82rem',
                  fontFamily: 'monospace'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowBulkImportModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-primary"
                  onClick={handleImportCsv}
                >
                  <FileSpreadsheet size={15} />
                  <span>Parse & Import CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE ADD PRODUCT MODAL */}
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
