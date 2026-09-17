import React from 'react';
import { Star, Clock, MapPin, Truck, CheckCircle2 } from 'lucide-react';

export const StoreCard = ({ store, onSelect }) => {
  return (
    <div className="store-card" onClick={onSelect} style={{ cursor: 'pointer' }}>
      <div className="store-img-wrap">
        <img 
          src={store.image} 
          alt={store.name} 
          className="store-img"
          loading="lazy"
        />
        {store.featuredBadge && (
          <span className="store-badge-top">{store.featuredBadge}</span>
        )}
        <div className="store-delivery-time">
          <Clock size={12} color="var(--primary)" />
          <span>{store.deliveryTime}</span>
        </div>
      </div>

      <div className="store-body">
        <div className="store-name-row">
          <h3 className="store-title">{store.name}</h3>
          <div className="rating-badge">
            <Star size={11} fill="#ffffff" />
            <span>{store.rating}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>
          <CheckCircle2 size={13} color="var(--emerald-600)" />
          <span>Managed by: {store.ownerName}</span>
        </div>

        <p className="store-desc">{store.description}</p>

        <div className="store-meta-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={13} color="var(--slate-400)" />
            <span>{store.address}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, color: 'var(--emerald-700)' }}>
            <Truck size={13} />
            <span>{store.deliveryFee === 0 ? 'FREE DELIVERY' : `₹${store.deliveryFee}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
