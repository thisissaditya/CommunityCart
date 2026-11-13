import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Utensils, 
  ShoppingBasket, 
  Pill, 
  AlertOctagon, 
  HeartHandshake, 
  PhoneCall, 
  TrendingUp, 
  Store, 
  X, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSearchSuggestionsApi } from '../../services/api';

export const HeroSection = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery, 
    setActiveTab, 
    setIsEmergencyModalOpen 
  } = useApp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [suggestionsData, setSuggestionsData] = useState({
    popularSearches: [
      'Shudh Ghee Thali',
      'Paneer Butter Masala',
      'Dal Makhani',
      'Khasta Samosa',
      'Desi Ghee Jalebi',
      'Chakki Atta',
      'Paracetamol 650mg',
      'Kulhad Chai'
    ],
    suggestions: [],
    products: [],
    stores: []
  });
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  // Debounced search suggestions backend query
  useEffect(() => {
    let timer = setTimeout(async () => {
      if (isSearchFocused || searchQuery.trim()) {
        setLoadingSuggestions(true);
        const res = await fetchSearchSuggestionsApi(searchQuery);
        if (res && res.success) {
          setSuggestionsData({
            popularSearches: res.popularSearches || suggestionsData.popularSearches,
            suggestions: res.suggestions || [],
            products: res.products || [],
            stores: res.stores || []
          });
        }
        setLoadingSuggestions(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, isSearchFocused]);

  // Click outside listener to dismiss search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (term) => {
    setSearchQuery(term);
    setIsSearchFocused(false);
    setActiveTab('marketplace');
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    setIsSearchFocused(false);
    setActiveTab('marketplace');
  };

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
      title: 'Village Kirana & Produce',
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

          {/* Quick Search with Real-time Backend Recommendations Dropdown */}
          <div 
            ref={searchContainerRef}
            style={{ position: 'relative', width: '100%', maxWidth: '640px' }}
          >
            <div className="hero-search-box">
              <input 
                type="text" 
                className="hero-search-input"
                placeholder="Search for shudh ghee thali, atta, milk, paracetamol or local dhabas..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsSearchFocused(false);
                    setActiveTab('marketplace');
                  } else if (e.key === 'Escape') {
                    setIsSearchFocused(false);
                  }
                }}
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--slate-400)',
                    cursor: 'pointer',
                    padding: '0.4rem',
                    marginRight: '0.2rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}

              <button 
                className="hero-search-btn" 
                onClick={() => {
                  setIsSearchFocused(false);
                  setActiveTab('marketplace');
                }}
              >
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>

            {/* Smart Search Recommendations Dropdown (Framer Motion) */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    background: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    border: '1px solid var(--slate-200)',
                    zIndex: 200,
                    overflow: 'hidden',
                    maxHeight: '440px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* Category Shortcut Strip */}
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: 'var(--slate-50)',
                    borderBottom: '1px solid var(--slate-100)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--slate-400)', textTransform: 'uppercase' }}>
                      Categories:
                    </span>
                    <button
                      onClick={() => handleSelectCategory('all')}
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: selectedCategory === 'all' ? 'var(--primary)' : '#ffffff',
                        color: selectedCategory === 'all' ? '#ffffff' : 'var(--slate-700)',
                        border: '1px solid var(--slate-200)',
                        cursor: 'pointer'
                      }}
                    >
                      All
                    </button>
                    <button
                      onClick={() => handleSelectCategory('food')}
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: selectedCategory === 'food' ? 'var(--primary)' : '#ffffff',
                        color: selectedCategory === 'food' ? '#ffffff' : 'var(--slate-700)',
                        border: '1px solid var(--slate-200)',
                        cursor: 'pointer'
                      }}
                    >
                      🍲 Food & Dhabas
                    </button>
                    <button
                      onClick={() => handleSelectCategory('grocery')}
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: selectedCategory === 'grocery' ? 'var(--primary)' : '#ffffff',
                        color: selectedCategory === 'grocery' ? '#ffffff' : 'var(--slate-700)',
                        border: '1px solid var(--slate-200)',
                        cursor: 'pointer'
                      }}
                    >
                      🥦 Kirana
                    </button>
                    <button
                      onClick={() => handleSelectCategory('pharmacy')}
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: selectedCategory === 'pharmacy' ? 'var(--primary)' : '#ffffff',
                        color: selectedCategory === 'pharmacy' ? '#ffffff' : 'var(--slate-700)',
                        border: '1px solid var(--slate-200)',
                        cursor: 'pointer'
                      }}
                    >
                      💊 Pharmacy
                    </button>
                  </div>

                  {/* Scrollable Body */}
                  <div style={{ overflowY: 'auto', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* If search query is empty: Show Popular Village Searches */}
                    {!searchQuery.trim() ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                          <TrendingUp size={13} color="var(--primary)" />
                          <span>Popular Village Searches</span>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                          {suggestionsData.popularSearches.map((term, i) => (
                            <button
                              key={i}
                              onClick={() => handleSelectSuggestion(term)}
                              style={{
                                padding: '0.35rem 0.75rem',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                background: 'var(--slate-100)',
                                color: 'var(--slate-800)',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--primary-50)';
                                e.currentTarget.style.color = 'var(--primary)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--slate-100)';
                                e.currentTarget.style.color = 'var(--slate-800)';
                              }}
                            >
                              <Search size={11} color="var(--slate-400)" />
                              <span>{term}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Autocomplete Suggestions */}
                        {suggestionsData.suggestions.length > 0 && (
                          <div>
                            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                              Search Suggestions
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              {suggestionsData.suggestions.map((sug, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleSelectSuggestion(sug)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.4rem 0.6rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'var(--slate-800)',
                                    fontSize: '0.84rem',
                                    fontWeight: 600,
                                    textAlign: 'left',
                                    cursor: 'pointer'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--slate-50)'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                  <Search size={13} color="var(--slate-400)" />
                                  <span>{sug}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Matching Products */}
                        {suggestionsData.products.length > 0 && (
                          <div>
                            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                              Matching Products ({suggestionsData.products.length})
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              {suggestionsData.products.map((p) => (
                                <div
                                  key={p._id || p.id}
                                  onClick={() => handleSelectSuggestion(p.name)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.4rem 0.6rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    background: 'var(--slate-50)',
                                    border: '1px solid var(--slate-100)'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <img 
                                      src={p.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=80'} 
                                      alt={p.name} 
                                      style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }}
                                    />
                                    <div>
                                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                                        {p.name}
                                      </div>
                                      <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>
                                        {p.storeName} • {p.unit || '1 plate'}
                                      </div>
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <strong style={{ fontSize: '0.85rem', color: 'var(--slate-900)' }}>
                                      ₹{p.price}
                                    </strong>
                                    <ArrowRight size={13} color="var(--slate-400)" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Matching Stores */}
                        {suggestionsData.stores.length > 0 && (
                          <div>
                            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                              Matching Local Stores & Dhabas
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              {suggestionsData.stores.map((s) => (
                                <div
                                  key={s._id || s.id}
                                  onClick={() => handleSelectSuggestion(s.name)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.4rem 0.6rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    background: 'var(--slate-50)',
                                    border: '1px solid var(--slate-100)'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <div style={{
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '6px',
                                      background: 'var(--primary-100)',
                                      color: 'var(--primary)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}>
                                      <Store size={16} />
                                    </div>
                                    <div>
                                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                                        {s.name}
                                      </div>
                                      <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>
                                        {s.category?.toUpperCase()} • {s.village || 'Rampur'}
                                      </div>
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                                    <span>★ {s.rating || 4.8}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {suggestionsData.products.length === 0 && suggestionsData.stores.length === 0 && suggestionsData.suggestions.length === 0 && (
                          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.85rem' }}>
                            Press Enter to search for "{searchQuery}"
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  <div style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--slate-50)',
                    borderTop: '1px solid var(--slate-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.72rem',
                    color: 'var(--slate-400)'
                  }}>
                    <span>Press <strong>Enter</strong> to search</span>
                    <span>Press <strong>Esc</strong> to dismiss</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
