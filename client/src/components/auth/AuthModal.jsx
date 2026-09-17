import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { loginApi, registerApi } from '../../services/api';
import { X, User, Store, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginUser, currentUser, logoutUser, showToast } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('citizen'); // 'citizen' | 'vendor' | 'admin'

  // Form Fields
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeCategory, setStoreCategory] = useState('restaurant');
  const [village, setVillage] = useState('Rampur Panchayat');

  if (!isAuthModalOpen) return null;

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone) {
      showToast('Please enter an email or mobile number', 'error');
      return;
    }

    if (mode === 'login') {
      const res = await loginApi({ email: emailOrPhone, role });
      if (res.success) {
        loginUser(res.user);
      } else {
        showToast(res.message || 'Login failed', 'error');
      }
    } else {
      if (!name) {
        showToast('Please enter your full name', 'error');
        return;
      }
      const res = await registerApi({
        name,
        email: emailOrPhone,
        phone: emailOrPhone.includes('@') ? '9876543210' : emailOrPhone,
        password: password || '123456',
        role,
        village,
        storeName: role === 'vendor' ? storeName : null,
        storeCategory: role === 'vendor' ? storeCategory : null,
      });

      if (res.success) {
        loginUser(res.user);
      } else {
        showToast(res.message || 'Registration failed', 'error');
      }
    }
  };

  const handleQuickDemoLogin = (selectedRole, demoName, email, shop = null) => {
    loginUser({
      id: `user-${selectedRole}`,
      name: demoName,
      email,
      phone: '9876543210',
      role: selectedRole,
      village: 'Rampur Panchayat',
      storeName: shop,
    });
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={() => setIsAuthModalOpen(false)}>
          <X size={16} />
        </button>

        {currentUser ? (
          /* Profile & Sign Out View */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--primary-100)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.25rem'
              }}>
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>{currentUser.name}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                  {currentUser.email} • {currentUser.village}
                </div>
              </div>
            </div>

            <div style={{
              background: 'var(--slate-50)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              border: '1px solid var(--slate-200)',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              fontSize: '0.85rem'
            }}>
              <div><strong>Account Type:</strong> <span style={{ textTransform: 'capitalize' }}>{currentUser.role}</span></div>
              {currentUser.storeName && (
                <div><strong>Registered Shop:</strong> {currentUser.storeName}</div>
              )}
              <div><strong>Service Coverage:</strong> {currentUser.village}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button 
                className="btn-secondary"
                onClick={() => setIsAuthModalOpen(false)}
              >
                Close
              </button>
              <button 
                className="btn-primary" 
                style={{ background: 'var(--emergency)' }}
                onClick={() => {
                  logoutUser();
                  setIsAuthModalOpen(false);
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>
                {mode === 'login' ? 'Sign In to CommunityCart' : 'Create Community Account'}
              </h3>
              <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem' }}>
                Access verified rural commerce, civic grievance services, and village announcements.
              </p>
            </div>

            {/* Role Switcher Tabs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              background: 'var(--slate-100)',
              padding: '0.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              gap: '0.25rem'
            }}>
              <button
                type="button"
                onClick={() => setRole('citizen')}
                style={{
                  border: 'none',
                  background: role === 'citizen' ? '#ffffff' : 'transparent',
                  color: role === 'citizen' ? 'var(--slate-900)' : 'var(--slate-600)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                  boxShadow: role === 'citizen' ? 'var(--shadow-xs)' : 'none'
                }}
              >
                <User size={14} /> Citizen
              </button>
              <button
                type="button"
                onClick={() => setRole('vendor')}
                style={{
                  border: 'none',
                  background: role === 'vendor' ? '#ffffff' : 'transparent',
                  color: role === 'vendor' ? 'var(--slate-900)' : 'var(--slate-600)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                  boxShadow: role === 'vendor' ? 'var(--shadow-xs)' : 'none'
                }}
              >
                <Store size={14} /> Shop Owner
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                style={{
                  border: 'none',
                  background: role === 'admin' ? '#ffffff' : 'transparent',
                  color: role === 'admin' ? 'var(--slate-900)' : 'var(--slate-600)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                  boxShadow: role === 'admin' ? 'var(--shadow-xs)' : 'none'
                }}
              >
                <Shield size={14} /> Panchayat
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {mode === 'register' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Aditya Rakesh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--slate-300)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Mobile Number or Email *
                </label>
                <input
                  type="text"
                  required
                  placeholder="9876543210 or user@example.com"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
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
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Password *
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {mode === 'register' && role === 'vendor' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                      Shop / Enterprise Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kisan Kirana & Provisions"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
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
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                      Business Category
                    </label>
                    <select
                      value={storeCategory}
                      onChange={(e) => setStoreCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--slate-300)',
                        fontSize: '0.9rem'
                      }}
                    >
                      <option value="restaurant">Food & Mess Catering</option>
                      <option value="grocery">Grocery & Farm Produce</option>
                      <option value="pharmacy">Chemist / Medical Store</option>
                    </select>
                  </div>
                </>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}>
                <span>{mode === 'login' ? 'Sign In Securely' : 'Complete Registration'}</span>
                <ArrowRight size={17} />
              </button>

              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                {mode === 'login' ? (
                  <span style={{ fontSize: '0.825rem', color: 'var(--slate-500)' }}>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Register Now
                    </button>
                  </span>
                ) : (
                  <span style={{ fontSize: '0.825rem', color: 'var(--slate-500)' }}>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Sign In
                    </button>
                  </span>
                )}
              </div>
            </form>

            {/* Quick One-Click Demo Logins for Project Evaluation */}
            <div style={{
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px dashed var(--slate-200)'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Instant Demo Access (For Reviewers)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
                  onClick={() => handleQuickDemoLogin('vendor', 'Ramesh Sharma', 'ramesh@sharmadhaba.com', 'Sharma Ji Ka Mess & Dhaba')}
                >
                  Demo Vendor
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
                  onClick={() => handleQuickDemoLogin('admin', 'Mukhiya Ji', 'admin@rampurpanchayat.gov.in')}
                >
                  Demo Admin
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
