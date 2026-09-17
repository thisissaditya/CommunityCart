import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchEmergencyContacts, triggerSOSApi } from '../../services/api';
import { PhoneCall, AlertTriangle, X, ShieldAlert, CheckCircle, Radio } from 'lucide-react';

export const EmergencyModal = () => {
  const { isEmergencyModalOpen, setIsEmergencyModalOpen, selectedVillage, currentUser, showToast } = useApp();
  const [contacts, setContacts] = useState([]);
  const [sosDispatched, setSosDispatched] = useState(false);
  const [sosType, setSosType] = useState('Medical (Ambulance 108)');

  useEffect(() => {
    const load = async () => {
      const data = await fetchEmergencyContacts();
      setContacts(data);
    };
    if (isEmergencyModalOpen) {
      load();
    }
  }, [isEmergencyModalOpen]);

  if (!isEmergencyModalOpen) return null;

  const handleBroadcastSOS = async () => {
    const res = await triggerSOSApi({
      citizenName: currentUser?.name || 'Local Resident',
      phone: currentUser?.phone || '9876543210',
      location: selectedVillage,
      serviceType: sosType,
    });

    if (res.success) {
      setSosDispatched(true);
      showToast('🚨 SOS broadcasted! Local Panchayat first responders alerted.');
      setTimeout(() => {
        setSosDispatched(false);
        setIsEmergencyModalOpen(false);
      }, 3000);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsEmergencyModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <button className="modal-close-btn" onClick={() => setIsEmergencyModalOpen(false)}>
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <div style={{
            background: 'var(--emergency)',
            color: '#ffffff',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--emergency)' }}>24/7 Rural Emergency Helpdesk</h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
              Instant telephone connection & village distress dispatch
            </div>
          </div>
        </div>

        {sosDispatched ? (
          <div style={{
            background: 'var(--emerald-50)',
            border: '1px solid var(--emerald-200)',
            borderRadius: 'var(--radius-md)',
            padding: '1.75rem',
            textAlign: 'center',
            margin: '1.5rem 0'
          }}>
            <CheckCircle size={42} color="var(--emerald-600)" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ color: 'var(--emerald-900)', fontSize: '1.2rem', marginBottom: '0.35rem' }}>
              Distress Broadcast Sent!
            </h4>
            <p style={{ color: 'var(--emerald-700)', fontSize: '0.85rem' }}>
              Alert ID generated. Nearest duty officer and rural ambulance dispatch unit in <strong>{selectedVillage}</strong> are responding.
            </p>
          </div>
        ) : (
          <>
            {/* SOS Dispatch Box */}
            <div style={{
              background: 'linear-gradient(135deg, #7f1d1d, #991b1b)',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              margin: '1rem 0 1.5rem 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Radio size={18} color="#fca5a5" />
                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>One-Touch Emergency Broadcast</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#fecaca', marginBottom: '0.85rem', lineHeight: 1.4 }}>
                Transmits your GPS/village coordinates to the Gram Panchayat disaster cell and emergency triage.
              </p>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  value={sosType}
                  onChange={(e) => setSosType(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-xs)',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: '#ffffff',
                    color: 'var(--slate-900)'
                  }}
                >
                  <option value="Medical (Ambulance 108)">🚑 Medical Emergency (Ambulance 108)</option>
                  <option value="Police / Law & Order (112)">👮 Police / Protection (112)</option>
                  <option value="Fire / Natural Hazard (101)">🚒 Fire / Hazard Disaster (101)</option>
                  <option value="Gram Panchayat Security Helpdesk">🏛️ Panchayat Security Helpdesk</option>
                </select>

                <button
                  className="btn-sos-header"
                  style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
                  onClick={handleBroadcastSOS}
                >
                  TRANSMIT SOS
                </button>
              </div>
            </div>

            {/* Direct Dial Helpline Numbers */}
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--slate-700)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Direct Rural Dial Directory
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {contacts.map((c) => (
                <div key={c.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--slate-200)',
                  background: '#ffffff'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--slate-900)' }}>
                      {c.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                      {c.description}
                    </div>
                  </div>

                  <a 
                    href={`tel:${c.number.replace(/\s+/g, '')}`}
                    className="btn-primary"
                    style={{
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.8rem',
                      background: 'var(--slate-900)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <PhoneCall size={13} />
                    {c.number}
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
