import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Minus, Tag } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { cart, addToCart, updateCartQuantity } = useApp();

  const cartItem = cart.find((item) => item.id === product.id);
  const qty = cartItem ? cartItem.quantity : 0;

  const discountAmount = product.originalPrice && product.originalPrice > product.price 
    ? product.originalPrice - product.price 
    : 0;

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-img" 
          loading="lazy"
        />
        {discountAmount > 0 && (
          <div style={{
            position: 'absolute',
            top: 8,
            left: 8,
            background: 'var(--emerald-600)',
            color: '#ffffff',
            fontSize: '0.68rem',
            fontWeight: 800,
            padding: '0.15rem 0.45rem',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem'
          }}>
            <Tag size={10} />
            SAVE ₹{discountAmount}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <div className="veg-indicator">
          <div className="veg-dot"></div>
        </div>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase' }}>
          {product.storeName}
        </span>
      </div>

      <h4 className="product-name">{product.name}</h4>
      <div className="product-unit">{product.unit}</div>

      <div className="product-footer">
        <div className="price-row">
          <span className="curr-price">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="orig-price">₹{product.originalPrice}</span>
          )}
        </div>

        {qty === 0 ? (
          <button 
            className="btn-add-item"
            onClick={() => addToCart(product)}
          >
            + ADD
          </button>
        ) : (
          <div className="qty-counter">
            <button 
              className="qty-btn"
              onClick={() => updateCartQuantity(product.id, -1)}
            >
              <Minus size={13} />
            </button>
            <span className="qty-val">{qty}</span>
            <button 
              className="qty-btn"
              onClick={() => updateCartQuantity(product.id, 1)}
            >
              <Plus size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
