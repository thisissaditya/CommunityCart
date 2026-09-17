import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchEvents } from '../../services/api';
import { Calendar, Clock, MapPin, Users, Heart, Award, ArrowRight } from 'lucide-react';

export const EventsSection = () => {
  const { showToast } = useApp();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredIds, setRegisteredIds] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchEvents();
      setEvents(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleRegister = (event) => {
    if (registeredIds.includes(event.id)) return;
    setRegisteredIds([...registeredIds, event.id]);
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, attendeesCount: e.attendeesCount + 1 } : e))
    );
    showToast(`Registered for ${event.title}! An SMS reminder will be sent.`);
  };

  return (
    <div style={{ margin: '2rem 0' }}>
      <div style={{
        background: 'linear-gradient(135deg, #064e3b, #047857)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        color: '#ffffff',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(255, 255, 255, 0.2)',
          color: '#d1fae5',
          padding: '0.25rem 0.75rem',
          borderRadius: 'var(--radius-pill)',
          fontSize: '0.75rem',
          fontWeight: 700,
          marginBottom: '0.75rem'
        }}>
          <Heart size={14} />
          Community Wellness & Welfare Drives
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
          Village Health Camps & Outreach Events
        </h2>
        <p style={{ color: '#a7f3d0', fontSize: '0.95rem', maxWidth: '650px', lineHeight: 1.5 }}>
          Discover free medical screening camps, voluntary blood donation centers, organic farming workshops, 
          and Gram Sabha meetings organized in collaboration with district administration.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {events.map((evt) => {
          const isReg = registeredIds.includes(evt.id);
          return (
            <div key={evt.id} style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--slate-200)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  background: 'var(--emerald-50)',
                  color: 'var(--emerald-700)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-pill)'
                }}>
                  {evt.category}
                </span>
                <span style={{
                  background: 'var(--primary-50)',
                  color: 'var(--primary-700)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-pill)'
                }}>
                  FREE ENTRY
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                {evt.title}
              </h3>

              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                {evt.description}
              </p>

              <div style={{
                background: 'var(--slate-50)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.825rem',
                color: 'var(--slate-700)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Calendar size={14} color="var(--primary)" />
                  <strong>Date:</strong> {evt.date}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Clock size={14} color="var(--primary)" />
                  <strong>Time:</strong> {evt.time}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <MapPin size={14} color="var(--primary)" />
                  <strong>Venue:</strong> {evt.venue}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Award size={14} color="var(--emerald-600)" />
                  <strong>Organizer:</strong> {evt.organizer}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px dashed var(--slate-200)',
                paddingTop: '0.85rem',
                marginTop: 'auto'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem', color: 'var(--slate-500)' }}>
                  <Users size={16} />
                  <span><strong>{evt.attendeesCount}</strong> villagers registered</span>
                </div>

                <button 
                  className={isReg ? 'btn-secondary' : 'btn-primary'}
                  style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                  onClick={() => handleRegister(evt)}
                  disabled={isReg}
                >
                  {isReg ? '✓ Attending' : 'Register Free'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
