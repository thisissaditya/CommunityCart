import React from 'react';
import { ShieldCheck, Heart, MapPin, Phone, Mail, FileCode } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      background: 'var(--slate-900)',
      color: 'var(--slate-300)',
      padding: '3.5rem 0 2rem 0',
      borderTop: '1px solid var(--slate-800)',
      marginTop: '4rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <img src="/logo.svg" alt="CommunityCart" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>CommunityCart</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-400)', lineHeight: 1.6, marginBottom: '1rem' }}>
              A unified digital ecosystem engineered for rural and semi-urban communities, bridging local commerce, 
              civic grievance transparency, healthcare accessibility, and disaster readiness.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--emerald-400)' }}>
              <ShieldCheck size={16} />
              <span>Developed for EPICS Academic Engineering Initiative</span>
            </div>
          </div>

          {/* Commerce & Food */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Commerce & Essentials
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li>Gramin Thali & Daily Mess Menus</li>
              <li>Village Kirana Provisions & Grains</li>
              <li>Direct Farmer Fresh Produce</li>
              <li>Generic Medicines & Health Kits</li>
              <li>Zero Advance Fee (Cash On Delivery)</li>
            </ul>
          </div>

          {/* Civic Governance */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Civic Engagement
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li>Panchayat Grievance Tracker</li>
              <li>Drinking Water & Road Repair Desk</li>
              <li>Rural Electricity Outage Reporting</li>
              <li>Free Medical & Eye Checkup Camps</li>
              <li>Blood Donation Volunteer Drives</li>
            </ul>
          </div>

          {/* Emergency & Contacts */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Emergency Directory
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171' }}>
                <Phone size={15} />
                <strong>National Ambulance: 108</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fca5a5' }}>
                <Phone size={15} />
                <strong>Police & Law Helpline: 112</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-400)' }}>
                <MapPin size={15} />
                <span>Rampur Gram Panchayat Bhavan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--slate-800)',
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.78rem',
          color: 'var(--slate-500)'
        }}>
          <div>
            © 2026 CommunityCart Project. Built with MERN Stack (React, Node, Express, MongoDB).
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Engineered with care for Rural Empowerment</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
