import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck, Phone, MapPin, Truck } from 'lucide-react';
import { PrescriptionUpload } from './PrescriptionUpload';
import { createOrderApi } from '../../services/api';

export const CartDrawer = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    clearCart, 
    cartSubtotal, 
    selectedVillage,
    currentUser,
    showToast,
    triggerSmsAlert,
    refreshOrders,
    setActiveTab
  } = useApp();

  const [orderPlacedData, setOrderPlacedData] = useState(null);
  const [customerAddress, setCustomerAddress] = useState('Near Primary School, Ward No. 3');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Aditya Rakesh');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [prescriptionUrl, setPrescriptionUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if cart has pharmacy items
  const hasPharmacyItems = cart.some(item => item.category === 'pharmacy');

  if (!isCartOpen) return null;

  const deliveryFee = cartSubtotal > 150 ? 0 : 15;
  const platformCommunityFee = 2; // Nominal rural server maintenance
  const totalPayable = cartSubtotal > 0 ? cartSubtotal + deliveryFee + platformCommunityFee : 0;

  // Determine primary store from items in cart
  const primaryStoreName = cart.length > 0 ? cart[0].storeName : 'Village Local Store';
  const primaryStoreId = cart.length > 0 ? (cart[0].storeId || 'store-1') : 'store-1';

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    if (hasPharmacyItems && !prescriptionUrl) {
      showToast('Please upload a valid prescription for pharmacy items', 'error');
      return;
    }

    if (!customerAddress.trim()) {
      showToast('Please specify your village delivery landmark or house', 'error');
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      customer: {
        name: customerName,
        phone: customerPhone,
        email: currentUser?.email || 'aditya@example.com',
        address: customerAddress,
        village: selectedVillage,
      },
      storeId: primaryStoreId,
      storeName: primaryStoreName,
      items: cart.map(it => ({
        productId: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        unit: it.unit || '1 item',
        category: it.category || 'food',
        isVeg: it.isVeg !== false,
        image: it.image,
      })),
      subtotal: cartSubtotal,
      deliveryFee,
      platformFee: platformCommunityFee,
      totalAmount: totalPayable,
      paymentMethod,
      prescriptionUrl,
    };

    const res = await createOrderApi(orderPayload);
    setIsSubmitting(false);

    if (res.success && res.order) {
      setOrderPlacedData(res.order);
      clearCart();
      refreshOrders();
      showToast('🎉 Order placed successfully! Local shopkeeper alerted.');

      // Dispatch Rural SMS simulation
      triggerSmsAlert({
        phone: customerPhone,
        title: 'Order Dispatched Alert',
        message: `Your order #${res.order.orderNumber} from ${primaryStoreName} has been received! Total: ₹${totalPayable} (${paymentMethod}). Shopkeeper is packing now.`,
      });
    } else {
      showToast(res.message || 'Failed to place order. Please try again.', 'error');
    }
  };

  const handleTrackOrder = () => {
    setOrderPlacedData(null);
    setIsCartOpen(false);
    setActiveTab('orders');
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
            onClick={() => {
              setOrderPlacedData(null);
              setIsCartOpen(false);
            }}
          >
            <X size={16} />
          </button>
        </div>

        {orderPlacedData ? (
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
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'var(--emerald-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              color: 'var(--emerald-600)'
            }}>
              <CheckCircle2 size={40} />
            </div>

            <span style={{
              background: 'var(--emerald-50)',
              color: 'var(--emerald-700)',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              marginBottom: '0.75rem'
            }}>
              {orderPlacedData.orderNumber}
            </span>

            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Order Placed with {orderPlacedData.storeName}!</h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem', maxWidth: '320px' }}>
              Your order is sent to the local vendor. An SMS notification has been dispatched to <strong>{orderPlacedData.customer?.phone}</strong>.
            </p>

            <div style={{
              width: '100%',
              background: 'var(--slate-50)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              border: '1px solid var(--slate-200)',
              marginBottom: '1.5rem',
              textAlign: 'left',
              fontSize: '0.84rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--slate-500)' }}>Total Payable:</span>
                <span style={{ fontWeight: 800, color: 'var(--slate-900)' }}>₹{orderPlacedData.totalAmount} ({orderPlacedData.paymentMethod})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--slate-500)' }}>Village:</span>
                <span style={{ fontWeight: 600 }}>{orderPlacedData.customer?.village}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-500)' }}>Handover Landmark:</span>
                <span style={{ fontWeight: 600 }}>{orderPlacedData.customer?.address}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%' }}>
              <button 
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleTrackOrder}
              >
                <Truck size={17} />
                <span>Track Live Order Status</span>
              </button>
              <button 
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  setOrderPlacedData(null);
                  setIsCartOpen(false);
                }}
              >
                Continue Browsing
              </button>
            </div>
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
              Add authentic dhaba meals, groceries or health medicines to start ordering.
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

              {/* Delivery Destination & Contact Details */}
              <div style={{
                background: 'var(--slate-50)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--slate-200)',
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    Delivery Village & Service Area
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--slate-800)' }}>
                    📍 {selectedVillage}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)', display: 'block', marginBottom: '0.25rem' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--slate-300)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)', display: 'block', marginBottom: '0.25rem' }}>
                    Mobile Number (For Village SMS Alerts)
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--slate-300)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)', display: 'block', marginBottom: '0.25rem' }}>
                    Delivery Address / Landmark
                  </label>
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

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)', display: 'block', marginBottom: '0.35rem' }}>
                    Payment Mode
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Cash on Delivery')}
                      style={{
                        padding: '0.5rem',
                        fontSize: '0.78rem',
                        fontWeight: paymentMethod === 'Cash on Delivery' ? 700 : 500,
                        background: paymentMethod === 'Cash on Delivery' ? 'var(--primary-50)' : '#ffffff',
                        border: paymentMethod === 'Cash on Delivery' ? '1.5px solid var(--primary)' : '1px solid var(--slate-200)',
                        color: paymentMethod === 'Cash on Delivery' ? 'var(--primary)' : 'var(--slate-700)',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer'
                      }}
                    >
                      💵 Cash on Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI on Delivery')}
                      style={{
                        padding: '0.5rem',
                        fontSize: '0.78rem',
                        fontWeight: paymentMethod === 'UPI on Delivery' ? 700 : 500,
                        background: paymentMethod === 'UPI on Delivery' ? 'var(--primary-50)' : '#ffffff',
                        border: paymentMethod === 'UPI on Delivery' ? '1.5px solid var(--primary)' : '1px solid var(--slate-200)',
                        color: paymentMethod === 'UPI on Delivery' ? 'var(--primary)' : 'var(--slate-700)',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer'
                      }}
                    >
                      📲 UPI on Handover
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '0.6rem' }}>
                <ShieldCheck size={16} color="var(--emerald-600)" />
                <span>Zero advance fee. Pay only after inspecting delivered items.</span>
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
                style={{ width: '100%', padding: '0.85rem', justifyContent: 'center' }}
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Placing Order...' : `Confirm Order (${paymentMethod})`}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
