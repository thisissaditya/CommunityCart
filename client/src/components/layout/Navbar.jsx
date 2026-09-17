import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  PhoneCall, 
  MapPin, 
  User, 
  ChevronDown, 
  Store, 
  ShieldAlert, 
  FileText, 
  Calendar, 
  LayoutDashboard,
  LogOut,
  Layers
} from 'lucide-react';

const VILLAGES = [
  'Rampur Panchayat',
  'Sundarpur Village',
  'Kishanpur Center',
  'Belgachia Rural Ward',
];

export const Navbar = () => {
  const { 
    currentUser, 
    switchRole, 
    logoutUser, 
    selectedVillage, 
    setSelectedVillage,
    activeTab, 
    setActiveTab, 
    cartCount, 
    setIsCartOpen,
    setIsEmergencyModalOpen,
    setIsAuthModalOpen 
  } = useApp();

  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  return (
    <>
      {/* 24x7 Emergency Help Strip */}
      <div className="emergency-strip">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="emergency-strip-content">
              <span className="emergency-pulse-dot"></span>
              <span>24/7 Rural Emergency Hotline: Call <strong>108</strong> (Ambulance), <strong>112</strong> (Police)</span>
            </div>
            <button 
              className="btn-sos-header"
              onClick={() => setIsEmergencyModalOpen(true)}
              title="Open Emergency Contacts & SOS Dispatch"
            >
              <PhoneCall size={13} />
              EMERGENCY SOS
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation Bar */}
      <header className="navbar-header">
        <div className="container">
          <div className="navbar-inner">
            {/* Logo and Brand */}
            <div className="brand-wrapper" onClick={() => setActiveTab('marketplace')}>
              <img src="/logo.svg" alt="CommunityCart" className="brand-logo" />
              <div>
                <div className="brand-text-title">CommunityCart</div>
                <div className="brand-text-sub">Unified Rural Community Platform</div>
              </div>
            </div>

            {/* Village Selector Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                className="location-selector"
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              >
                <MapPin size={18} color="var(--primary)" />
                <div className="location-text">
                  <span className="location-label">Service Area</span>
                  <span className="location-val">{selectedVillage}</span>
                </div>
                <ChevronDown size={14} color="var(--slate-400)" />
              </button>

              {isLocationDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '0.5rem',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--slate-200)',
                  width: '220px',
                  zIndex: 110,
                  padding: '0.5rem 0'
                }}>
                  <div style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase' }}>
                    Select Your Village / Area
                  </div>
                  {VILLAGES.map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setSelectedVillage(v);
                        setIsLocationDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem',
                        textAlign: 'left',
                        background: selectedVillage === v ? 'var(--primary-50)' : 'transparent',
                        color: selectedVillage === v ? 'var(--primary)' : 'var(--slate-700)',
                        fontWeight: selectedVillage === v ? 700 : 500,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <MapPin size={14} />
                      {v}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Tab Links */}
            <nav className="nav-links-row">
              <button 
                className={`nav-link-btn ${activeTab === 'marketplace' ? 'active' : ''}`}
                onClick={() => setActiveTab('marketplace')}
              >
                <Store size={17} />
                Marketplace
              </button>

              <button 
                className={`nav-link-btn ${activeTab === 'complaints' ? 'active' : ''}`}
                onClick={() => setActiveTab('complaints')}
              >
                <FileText size={17} />
                Civic Complaints
              </button>

              <button 
                className={`nav-link-btn ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => setActiveTab('events')}
              >
                <Calendar size={17} />
                Health & Events
              </button>

              <button 
                className={`nav-link-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard size={17} />
                Management Portal
              </button>
            </nav>

            {/* Right Actions: Role Preview, Cart, Auth */}
            <div className="nav-actions">
              {/* Role Switcher Pill Dropdown */}
              <div style={{ position: 'relative' }}>
                <button 
                  className={`role-pill ${currentUser ? currentUser.role : 'citizen'}`}
                  onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                  title="Switch User Role View"
                >
                  <Layers size={13} />
                  <span>Role: {currentUser ? currentUser.role.toUpperCase() : 'CITIZEN'}</span>
                  <ChevronDown size={12} />
                </button>

                {isRoleMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    background: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--slate-200)',
                    width: '210px',
                    zIndex: 110,
                    padding: '0.5rem 0'
                  }}>
                    <div style={{ padding: '0.4rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase' }}>
                      Switch Experience Mode
                    </div>
                    <button
                      onClick={() => { switchRole('citizen'); setIsRoleMenuOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '0.6rem 1rem',
                        textAlign: 'left',
                        background: currentUser?.role === 'citizen' ? 'var(--emerald-50)' : 'transparent',
                        color: currentUser?.role === 'citizen' ? 'var(--emerald-700)' : 'var(--slate-700)',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      🌿 Citizen / Buyer View
                    </button>
                    <button
                      onClick={() => { switchRole('vendor'); setActiveTab('dashboard'); setIsRoleMenuOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '0.6rem 1rem',
                        textAlign: 'left',
                        background: currentUser?.role === 'vendor' ? 'var(--primary-50)' : 'transparent',
                        color: currentUser?.role === 'vendor' ? 'var(--primary-700)' : 'var(--slate-700)',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      🏪 Shop Owner / Vendor Portal
                    </button>
                    <button
                      onClick={() => { switchRole('admin'); setActiveTab('dashboard'); setIsRoleMenuOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '0.6rem 1rem',
                        textAlign: 'left',
                        background: currentUser?.role === 'admin' ? 'var(--slate-100)' : 'transparent',
                        color: currentUser?.role === 'admin' ? 'var(--slate-900)' : 'var(--slate-700)',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      🏛️ Panchayat Admin Portal
                    </button>
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <button 
                className="btn-cart-nav"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag size={18} />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="cart-count-badge">{cartCount}</span>
                )}
              </button>

              {/* User Auth Profile Trigger */}
              {currentUser ? (
                <button
                  className="btn-secondary"
                  onClick={() => setIsAuthModalOpen(true)}
                  style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
                  title="Profile & Settings"
                >
                  <User size={16} />
                  <span>{currentUser.name.split(' ')[0]}</span>
                </button>
              ) : (
                <button 
                  className="btn-primary"
                  onClick={() => setIsAuthModalOpen(true)}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
