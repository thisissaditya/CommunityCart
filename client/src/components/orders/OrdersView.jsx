import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchUserOrdersApi, updateOrderStatusApi } from '../../services/api';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ChefHat, 
  Phone, 
  MapPin, 
  RefreshCw, 
  MessageSquare, 
  ChevronRight, 
  ShoppingBag,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const STATUS_STEPS = [
  { key: 'Placed', label: 'Order Placed', desc: 'Sent to shopkeeper' },
  { key: 'Accepted', label: 'Accepted', desc: 'Store confirmed' },
  { key: 'Preparing', label: 'Cooking & Packing', desc: 'Freshly prepared' },
  { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Rider en route' },
  { key: 'Delivered', label: 'Delivered', desc: 'Handed over at doorstep' },
];

export const OrdersView = () => {
  const { currentUser, setActiveTab, triggerSmsAlert, showToast, orderRefreshKey } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'delivered'
  const [simulatingId, setSimulatingId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    const email = currentUser?.email || 'aditya@example.com';
    const data = await fetchUserOrdersApi(email);
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [currentUser, orderRefreshKey]);

  const getStepIndex = (status) => {
    switch (status) {
      case 'Placed': return 0;
      case 'Accepted': return 1;
      case 'Preparing': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Placed': return 'Accepted';
      case 'Accepted': return 'Preparing';
      case 'Preparing': return 'Out for Delivery';
      case 'Out for Delivery': return 'Delivered';
      default: return null;
    }
  };

  const handleSimulateNextStep = async (order) => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) {
      showToast('Order is already delivered!', 'info');
      return;
    }

    setSimulatingId(order.id);
    const res = await updateOrderStatusApi(order.id, nextStatus, `Live update simulated via platform`, 'Raju Rider');
    setSimulatingId(null);

    if (res.success && res.order) {
      setOrders(prev => prev.map(o => (o.id === order.id ? { ...res.order, id: res.order._id || res.order.id } : o)));
      showToast(`Order status updated to "${nextStatus}"!`);

      // Trigger visual SMS alert toast
      triggerSmsAlert({
        phone: order.customer?.phone || '+91 98765 43210',
        title: `Order Update: ${nextStatus}`,
        message: res.order.smsNotification?.lastMessage || `Order #${order.orderNumber} is now ${nextStatus}`,
      });
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === 'active') return o.status !== 'Delivered' && o.status !== 'Cancelled';
    if (filter === 'delivered') return o.status === 'Delivered';
    return true;
  });

  return (
    <div style={{ padding: '1.5rem 0 3.5rem 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--primary-100)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Truck size={20} />
            </div>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--slate-900)' }}>My Orders & Deliveries</h2>
          </div>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Live status tracking with simulated rural SMS alerts for meals and groceries.
          </p>
        </div>

        <button 
          className="btn-secondary" 
          onClick={loadOrders}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs-row" style={{ marginBottom: '1.5rem' }}>
        <button
          className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Orders ({orders.length})
        </button>
        <button
          className={`filter-pill ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active Tracking ({orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length})
        </button>
        <button
          className={`filter-pill ${filter === 'delivered' ? 'active' : ''}`}
          onClick={() => setFilter('delivered')}
        >
          Delivered Past Orders ({orders.filter(o => o.status === 'Delivered').length})
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-400)' }}>
          <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
          <p>Connecting to village database...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          border: '1px solid var(--slate-200)',
          maxWidth: '520px',
          margin: '0 auto'
        }}>
          <ShoppingBag size={48} color="var(--slate-300)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No orders found in this category</h3>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Order fresh meals from Sharmaji Ka Dhaba, Apna Dhaba or groceries from local stores.
          </p>
          <button className="btn-primary" onClick={() => setActiveTab('marketplace')}>
            Explore Village Dhaba & Kirana Catalogue
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredOrders.map((order) => {
            const currentStepIdx = getStepIndex(order.status);
            const nextStatus = getNextStatus(order.status);

            return (
              <div 
                key={order.id} 
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--slate-200)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden'
                }}
              >
                {/* Order Top Bar */}
                <div style={{
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid var(--slate-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  background: 'var(--slate-50)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      background: '#0f172a',
                      color: '#ffffff',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '8px',
                      letterSpacing: '0.04em'
                    }}>
                      {order.orderNumber}
                    </span>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', color: 'var(--slate-900)' }}>{order.storeName}</h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      background: order.status === 'Delivered' 
                        ? 'var(--emerald-100)' 
                        : order.status === 'Out for Delivery' 
                        ? '#ede9fe' 
                        : 'var(--amber-100)',
                      color: order.status === 'Delivered' 
                        ? 'var(--emerald-800)' 
                        : order.status === 'Out for Delivery' 
                        ? '#6d28d9' 
                        : 'var(--amber-800)'
                    }}>
                      ● {order.status.toUpperCase()}
                    </span>

                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--slate-900)' }}>
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Tracking Stepper Progress Bar */}
                <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid var(--slate-100)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', position: 'relative' }}>
                    {STATUS_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                          {/* Step Connector Line */}
                          {idx > 0 && (
                            <div style={{
                              position: 'absolute',
                              top: '16px',
                              right: '50%',
                              width: '100%',
                              height: '4px',
                              background: idx <= currentStepIdx ? 'var(--primary)' : 'var(--slate-200)',
                              zIndex: 1
                            }} />
                          )}

                          {/* Node Icon */}
                          <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: isCurrent 
                              ? 'var(--primary)' 
                              : isCompleted 
                              ? 'var(--emerald-600)' 
                              : 'var(--slate-100)',
                            color: isCompleted ? '#ffffff' : 'var(--slate-400)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2,
                            boxShadow: isCurrent ? '0 0 0 4px var(--primary-100)' : 'none',
                            transition: 'all 0.3s ease'
                          }}>
                            {isCompleted && !isCurrent ? (
                              <CheckCircle2 size={18} />
                            ) : idx === 0 ? (
                              <Package size={16} />
                            ) : idx === 1 ? (
                              <CheckCircle2 size={16} />
                            ) : idx === 2 ? (
                              <ChefHat size={16} />
                            ) : idx === 3 ? (
                              <Truck size={16} />
                            ) : (
                              <CheckCircle2 size={16} />
                            )}
                          </div>

                          <div style={{ marginTop: '0.6rem' }}>
                            <div style={{
                              fontSize: '0.8rem',
                              fontWeight: isCurrent ? 800 : isCompleted ? 700 : 500,
                              color: isCurrent ? 'var(--primary)' : isCompleted ? 'var(--slate-900)' : 'var(--slate-400)'
                            }}>
                              {step.label}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)', marginTop: '0.1rem', display: 'none' }}>
                              {step.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items & Delivery Details Grid */}
                <div style={{ padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {/* Ordered Items Preview */}
                  <div>
                    <h5 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                      Ordered Items ({order.items?.length || 0})
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {order.items?.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <img 
                              src={item.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=100'} 
                              alt={item.name} 
                              style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                                {item.name}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                                Qty: {item.quantity} • {item.unit || '1 plate'}
                              </div>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.86rem', fontWeight: 700 }}>
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Info & Rural SMS Notification Box */}
                  <div>
                    <h5 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                      Delivery & SMS Gateway
                    </h5>
                    
                    <div style={{ background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', padding: '0.85rem', border: '1px solid var(--slate-200)', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', color: 'var(--slate-700)', marginBottom: '0.3rem' }}>
                        <MapPin size={14} color="var(--primary)" />
                        <strong>{order.customer?.address}</strong> ({order.customer?.village})
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                        <Phone size={13} /> Contact: {order.customer?.phone} • {order.paymentMethod}
                      </div>
                    </div>

                    {/* Dispatched SMS Message Preview */}
                    {order.smsNotification?.lastMessage && (
                      <div style={{
                        background: '#0f172a',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        color: '#f8fafc',
                        fontSize: '0.78rem',
                        lineHeight: 1.45,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.3rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontWeight: 700 }}>
                          <MessageSquare size={12} />
                          <span>Rural SMS Alert Sent:</span>
                        </div>
                        <div style={{ color: '#cbd5e1' }}>
                          "{order.smsNotification.lastMessage}"
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions / Interactive Progression Simulation */}
                <div style={{
                  padding: '1rem 1.5rem',
                  background: 'var(--slate-50)',
                  borderTop: '1px solid var(--slate-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                    Payment: <strong>{order.paymentMethod}</strong> (Status: <strong>{order.paymentStatus}</strong>)
                  </div>

                  {nextStatus && (
                    <button
                      className="btn-primary"
                      style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}
                      onClick={() => handleSimulateNextStep(order)}
                      disabled={simulatingId === order.id}
                    >
                      <Sparkles size={14} />
                      <span>Simulate Next Step: Move to "{nextStatus}"</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

