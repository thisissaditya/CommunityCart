import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/marketplace/HeroSection';
import { StoreCard } from './components/marketplace/StoreCard';
import { ProductCard } from './components/marketplace/ProductCard';
import { CartDrawer } from './components/marketplace/CartDrawer';
import { ComplaintSection } from './components/complaints/ComplaintSection';
import { EventsSection } from './components/events/EventsSection';
import { ManagementDashboard } from './components/dashboard/ManagementDashboard';
import { OrdersView } from './components/orders/OrdersView';
import { SmsNotificationToast } from './components/common/SmsNotificationToast';
import { EmergencyModal } from './components/emergency/EmergencyModal';
import { AuthModal } from './components/auth/AuthModal';
import { Footer } from './components/layout/Footer';
import { fetchStores, fetchProducts } from './services/api';
import { Utensils, ShoppingBasket, Pill, Filter, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import './styles/global.css';

const MainContent = () => {
  const { 
    activeTab, 
    selectedCategory, 
    setSelectedCategory, 
    selectedVillage, 
    searchQuery,
    toast 
  } = useApp();

  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [sData, pData] = await Promise.all([
        fetchStores(selectedCategory, selectedVillage),
        fetchProducts(selectedCategory, searchQuery),
      ]);
      setStores(sData);
      setProducts(pData);
      setLoading(false);
    };
    loadData();
  }, [selectedCategory, selectedVillage, searchQuery]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Floating Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 300,
          background: toast.type === 'error' ? 'var(--emergency)' : toast.type === 'info' ? 'var(--slate-900)' : 'var(--emerald-600)',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          animation: 'slideUp 0.25s ease-out'
        }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : toast.type === 'info' ? <Info size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="container" style={{ flex: 1 }}>
        {/* Marketplace View */}
        {activeTab === 'marketplace' && (
          <>
            <HeroSection />

            {/* Category Filter Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="filter-tabs-row" style={{ margin: 0 }}>
                <button
                  className={`filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  <Filter size={14} /> All Categories
                </button>
                <button
                  className={`filter-pill ${selectedCategory === 'food' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('food')}
                >
                  <Utensils size={14} /> Food & Mess Meals
                </button>
                <button
                  className={`filter-pill ${selectedCategory === 'grocery' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('grocery')}
                >
                  <ShoppingBasket size={14} /> Kirana & Groceries
                </button>
                <button
                  className={`filter-pill ${selectedCategory === 'pharmacy' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('pharmacy')}
                >
                  <Pill size={14} /> Generic Pharmacy
                </button>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                Showing verified local vendors in <strong>{selectedVillage}</strong>
              </div>
            </div>

            {/* Verified Local Stores Section */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.35rem' }}>Verified Village Shops & Providers</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>{stores.length} open now</span>
              </div>

              <div className="stores-grid">
                {stores.map((s) => (
                  <StoreCard 
                    key={s.id} 
                    store={s} 
                    onSelect={() => setSelectedCategory(s.category)} 
                  />
                ))}
              </div>
            </div>

            {/* Popular Products Catalogue Grid */}
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem' }}>Direct Village Catalogue</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.15rem' }}>
                    Fresh items from verified sellers with doorstep Cash-on-Delivery
                  </p>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>{products.length} items available</span>
              </div>

              <div className="products-grid">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Civic Grievances View */}
        {activeTab === 'complaints' && <ComplaintSection />}

        {/* My Orders & Delivery Tracking View */}
        {activeTab === 'orders' && <OrdersView />}

        {/* Health Camps & Community Events View */}
        {activeTab === 'events' && <EventsSection />}

        {/* Management Portal / Dashboard View */}
        {activeTab === 'dashboard' && <ManagementDashboard />}
      </div>

      {/* Global Modals, Drawers & Simulated Rural SMS Alerts */}
      <CartDrawer />
      <EmergencyModal />
      <AuthModal />
      <SmsNotificationToast />

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
