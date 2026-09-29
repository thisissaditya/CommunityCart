import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PrescriptionUpload } from './PrescriptionUpload';

export const CartDrawer = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    clearCart, 
    cartSubtotal, 
    selectedVillage,
    showToast 
  } = useApp();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [customerAddress, setCustomerAddress] = useState('Near Primary School, Ward No. 3');
  const [prescriptionUrl, setPrescriptionUrl] = useState(null);

  // Check if cart has pharmacy items
  const hasPharmacyItems = cart.some(item => item.category === 'pharmacy');

  if (!isCartOpen) return null;

  const deliveryFee = cartSubtotal > 150 ? 0 : 15;
  const platformCommunityFee = 2; // Nominal rural server maintenance
  const totalPayable = cartSubtotal > 0 ? cartSubtotal + deliveryFee + platformCommunityFee : 0;

  const handlePlaceOrder = () => {
    if (hasPharmacyItems && !prescriptionUrl) {
      showToast('Please upload a valid prescription for pharmacy items', 'error');
      return;
    }
    
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      setOrderPlaced(false);
      setIsCartOpen(false);
      setPrescriptionUrl(null);
      showToast('🎉 Order placed successfully! Local vendor will dispatch shortly.');
    }, 2000);
  };

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem' }}>Your Village Cart</h3>
          </div>
          <button 
            className="modal-close-btn" 
            style={{ position: 'static' }}
            onClick={() => setIsCartOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        {orderPlaced ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--emerald-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              color: 'var(--emerald-600)'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Order Confirmed!</h3>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
              Your order is sent to the local shopkeeper. Pay cash upon delivery to your doorstep.
            </p>
          </div>
        ) : cart.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            padding: '2rem',
            textAlign: 'center'
          }}>
            <ShoppingBag size={48} color="var(--slate-300)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ color: 'var(--slate-700)', marginBottom: '0.4rem' }}>Your cart is empty</h4>
            <p style={{ color: 'var(--slate-400)', fontSize: '0.85rem' }}>
              Add wholesome mess meals, groceries or health medicines to start ordering.
            </p>
          </div>
        ) : (
          <>
            <div className="cart-items-body">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--slate-900)' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                      {item.storeName} • ₹{item.price} each
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="qty-counter" style={{ transform: 'scale(0.9)' }}>
                      <button className="qty-btn" onClick={() => updateCartQuantity(item.id, -1)}>
                        <Minus size={12} />
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateCartQuantity(item.id, 1)}>
                        <Plus size={12} />
                      </button>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', minWidth: '48px', textAlign: 'right' }}>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}

              {/* Delivery Destination Input */}
              <div style={{
                background: 'var(--slate-50)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--slate-200)',
                marginTop: '1rem'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  Delivery Village & Landmark
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--slate-800)', marginBottom: '0.4rem' }}>
                  📍 {selectedVillage}
                </div>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="House number, landmark, pole no."
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--emerald-600)" />
                <span>Pay on Delivery (Cash / UPI on handover). No advance payment needed.</span>
              </div>
              
              {hasPharmacyItems && (
                <PrescriptionUpload onUploadSuccess={(url) => setPrescriptionUrl(url)} />
              )}
            </div>

            <div className="cart-footer">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-600)' }}>
                  <span>Items Subtotal</span>
                  <span>₹{cartSubtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-600)' }}>
                  <span>Local Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-600)' }}>
                  <span>Community Service Fee</span>
                  <span>₹{platformCommunityFee}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: 'var(--slate-900)',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--slate-200)',
                  marginTop: '0.2rem'
                }}>
                  <span>Total Payable</span>
                  <span>₹{totalPayable}</span>
                </div>
              </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '0.85rem' }}
                onClick={handlePlaceOrder}
              >
                <span>Confirm Order (Cash on Delivery)</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
