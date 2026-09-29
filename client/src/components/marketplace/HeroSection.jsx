import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Utensils, ShoppingBasket, Pill, AlertOctagon, HeartHandshake, PhoneCall } from 'lucide-react';

export const HeroSection = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery, 
    setActiveTab, 
    setIsEmergencyModalOpen 
  } = useApp();

  const services = [
    {
      id: 'food',
      title: 'Gramin Food & Mess',
      sub: 'Daily thalis, rotis & snacks',
      icon: <Utensils size={24} color="#EA580C" />,
      bgColor: '#FFF7ED',
      type: 'category',
    },
    {
      id: 'grocery',
      title: 'Purshottam Rakesh',
      sub: 'Atta, milk, spices & veggies',
      icon: <ShoppingBasket size={24} color="#059669" />,
      bgColor: '#ECFDF5',
      type: 'category',
    },
    {
      id: 'pharmacy',
      title: 'Jan Aushadhi Kendra',
      sub: 'Medicines, first-aid & kits',
      icon: <Pill size={24} color="#2563EB" />,
      bgColor: '#EFF6FF',
      type: 'category',
    },
    {
      id: 'complaints',
      title: 'Civic Grievances',
      sub: 'Road, electricity, water repair',
      icon: <AlertOctagon size={24} color="#D97706" />,
      bgColor: '#FEF3C7',
      type: 'tab',
      tabName: 'complaints',
    },
    {
      id: 'events',
      title: 'Health Camps & Drives',
      sub: 'Free eye check, blood camps',
      icon: <HeartHandshake size={24} color="#7C3AED" />,
      bgColor: '#F5F3FF',
      type: 'tab',
      tabName: 'events',
    },
    {
      id: 'sos',
      title: 'Emergency SOS Hotline',
      sub: 'Ambulance 108 & Police 112',
      icon: <PhoneCall size={24} color="#DC2626" />,
      bgColor: '#FEF2F2',
      type: 'sos',
    },
  ];

  const handleTileClick = (service) => {
    if (service.type === 'category') {
      setSelectedCategory(service.id);
      setActiveTab('marketplace');
    } else if (service.type === 'tab') {
      setActiveTab(service.tabName);
    } else if (service.type === 'sos') {
      setIsEmergencyModalOpen(true);
    }
  };

  return (
    <div>
      {/* Hero Banner with Swiggy-like vibrancy */}
      <div className="hero-banner">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="hero-content">
          <div className="hero-tag">
            <span>🌾 Empowering Rural & Semi-Urban India</span>
          </div>
          <h1 className="hero-title">
            Village Essentials & Civic Care, <span>Delivered Together.</span>
          </h1>
          <p className="hero-desc">
            Order meals from local mess providers, procure daily provisions from village kirana shops, 
            receive subsidized medicines, and resolve civic complaints with your Gram Panchayat in one place.
          </p>

          {/* Quick Search */}
          <div className="hero-search-box">
            <input 
              type="text" 
              className="hero-search-input"
              placeholder="Search for shudh ghee thali, atta, milk, paracetamol or local shops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="hero-search-btn" onClick={() => setActiveTab('marketplace')}>
              <Search size={18} />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Services Grid (6 Unified Core Pillars) */}
      <div className="services-section-title">
        <div>
          <h2>Essential Village Services</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
            Select a service to browse verified local providers and civic initiatives
          </p>
        </div>
      </div>

      <div className="service-tiles-grid">
        {services.map((s) => {
          const isSelected = s.type === 'category' && selectedCategory === s.id;
          return (
            <div 
              key={s.id} 
              className={`service-tile-card ${isSelected ? 'active' : ''}`}
              onClick={() => handleTileClick(s)}
            >
              <div className="service-icon-wrap" style={{ backgroundColor: s.bgColor }}>
                {s.icon}
              </div>
              <div className="service-tile-title">{s.title}</div>
              <div className="service-tile-sub">{s.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
