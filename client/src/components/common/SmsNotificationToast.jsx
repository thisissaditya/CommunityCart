import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Phone, X, CheckCheck } from 'lucide-react';

export const SmsNotificationToast = () => {
  const { smsAlert, setSmsAlert } = useApp();

  if (!smsAlert) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '24px',
      zIndex: 400,
      maxWidth: '380px',
      width: 'calc(100vw - 3rem)',
      background: '#0f172a',
      color: '#f8fafc',
      borderRadius: '14px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
      border: '1px solid #334155',
      padding: '1rem 1.15rem',
      animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <MessageSquare size={14} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Rural SMS Gateway
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8' }}>
              To: {smsAlert.phone}
            </div>
          </div>
        </div>

        <button 
          onClick={() => setSmsAlert(null)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{
        background: '#1e293b',
        borderRadius: '8px',
        padding: '0.7rem 0.85rem',
        fontSize: '0.84rem',
        lineHeight: 1.45,
        color: '#e2e8f0',
        borderLeft: '3px solid var(--primary)'
      }}>
        "{smsAlert.message}"
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <CheckCheck size={13} color="#22c55e" /> Sent via BSNL / Jio Rural Cell
        </span>
        <span>{smsAlert.timestamp}</span>
      </div>
    </div>
  );
};

