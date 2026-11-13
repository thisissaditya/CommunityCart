import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchComplaints, postComplaint } from '../../services/api';
import ExpandableTicketCard from './ExpandableTicketCard';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  MapPin, 
  Send, 
  ShieldAlert, 
  Filter, 
  UserCheck, 
  Phone,
  Flame,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  FileText,
  X,
  Radio
} from 'lucide-react';

export const ComplaintSection = () => {
  const { selectedVillage, currentUser, showToast, triggerSmsAlert } = useApp();

  const [complaints, setComplaints] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Water Supply');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('High');
  const [citizenPhone, setCitizenPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'All',
    'Water Supply',
    'Electricity',
    'Roads & Transport',
    'Sanitation & Waste',
    'Healthcare'
  ];

  const loadComplaints = async () => {
    setLoading(true);
    const data = await fetchComplaints(selectedFilter, selectedCategoryFilter);
    setComplaints(data);
    setLoading(false);
  };

  useEffect(() => {
    loadComplaints();
  }, [selectedFilter, selectedCategoryFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !location) {
      showToast('Please fill all mandatory fields', 'error');
      return;
    }

    setIsSubmitting(true);
    const ticketId = `CMP-2026-${Math.floor(100 + Math.random() * 900)}`;

    const payload = {
      ticketId,
      title,
      category,
      description,
      fullDescription: description,
      location,
      priority,
      village: selectedVillage,
      citizenName: currentUser?.name || 'Aditya Rakesh',
      citizenPhone: citizenPhone || '+91 98765 43210',
      affectedCount: priority === 'Critical' ? 45 : priority === 'High' ? 24 : 12,
      assignedOfficer: category === 'Water Supply' ? 'Er. Rajesh Mishra (Jal Sansthan)' : category === 'Electricity' ? 'JE Alok Dubey (Bijli Board)' : 'Gram Rozgar Sahayak',
      officer: category === 'Water Supply' ? 'Er. Rajesh Mishra (Jal Sansthan)' : category === 'Electricity' ? 'JE Alok Dubey (Bijli Board)' : 'Gram Rozgar Sahayak',
      officerPhone: '+91 94123 45678',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      slaTarget: priority === 'Critical' ? 'Within 4 Hours' : 'Within 12 Hours',
      stages: [
        { label: 'Grievance Logged', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { label: 'Panchayat Review', time: 'Pending', completed: false, current: true },
        { label: 'Field Inspection', time: 'Pending', completed: false },
        { label: 'Resolution Completed', time: 'Pending', completed: false }
      ]
    };

    const res = await postComplaint(payload);
    setIsSubmitting(false);

    if (res.success) {
      showToast('Grievance logged! Forwarded to Panchayat Seva Kendra.');
      triggerSmsAlert({
        phone: citizenPhone,
        title: 'Grievance Registered',
        message: `Your grievance #${ticketId} regarding "${title}" has been registered. Tracking ID: ${ticketId}. Panchayat officer notified.`,
      });
      setShowSubmitModal(false);
      setTitle('');
      setDescription('');
      setLocation('');
      loadComplaints();
    } else {
      showToast(res.message || 'Failed to submit complaint', 'error');
    }
  };

  // Metrics
  const totalCount = complaints.length || 4;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const criticalCount = complaints.filter(c => c.priority === 'Critical' || c.priority === 'High').length;
  const resolutionPercentage = Math.round((resolvedCount / (totalCount || 1)) * 100);

  // Filtered list
  const filteredList = complaints.filter(c => {
    const matchesStatus = selectedFilter === 'All' || c.status?.toLowerCase() === selectedFilter.toLowerCase();
    const matchesCat = selectedCategoryFilter === 'All' || c.category?.toLowerCase() === selectedCategoryFilter.toLowerCase();
    return matchesStatus && matchesCat;
  });

  return (
    <div style={{ margin: '1.5rem 0 3.5rem 0' }}>
      {/* 1. TOP STATS BAR (Inspired by Stitch Mockup) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            Total Registered Issues
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            342
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
            100% Public Audit Trail
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            Resolution Rate
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--emerald-600)' }}>
            289 <span style={{ fontSize: '1rem', fontWeight: 700 }}>({resolutionPercentage || 84.5}%)</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--emerald-700)', marginTop: '0.2rem' }}>
            Verified with citizen sign-off
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            Avg. Resolution Speed
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            36 <span style={{ fontSize: '1rem', fontWeight: 700 }}>hours</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
            4.2x faster than paper petitions
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            Active Critical & Urgent
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#dc2626' }}>
            {criticalCount || 2} <span style={{ fontSize: '1rem', fontWeight: 700 }}>urgent</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#b91c1c', marginTop: '0.2rem' }}>
            High-urgency lineman alerts sent
          </div>
        </div>
      </div>

      {/* 2. HEADER BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.25rem',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ maxWidth: '680px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(217, 119, 6, 0.2)',
            border: '1px solid rgba(217, 119, 6, 0.4)',
            color: '#fef3c7',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}>
            <ShieldAlert size={14} color="#f59e0b" />
            Digital India Gramin Vikas • Public Accountability
          </div>

          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
            Panchayat Samadhan Desk (ग्राम समाधान मंच)
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
            {selectedVillage} Public Transparency Portal. Verified civic complaint logging, public officer 
            accountability pipeline, and live SMS tracking to resolve village infrastructure defects.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(255,255,255,0.1)',
            padding: '0.4rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.78rem',
            color: '#38bdf8',
            fontWeight: 600
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', display: 'inline-block' }} />
            Live SMS Gateway Active
          </div>

          <button 
            className="btn-primary"
            style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem', background: 'var(--primary)', color: '#ffffff' }}
            onClick={() => setShowSubmitModal(true)}
          >
            <PlusCircle size={17} />
            File New Village Grievance
          </button>
        </div>
      </div>

      {/* 3. MAIN CONTENT: TICKET LEDGER */}
      <div>
        {/* Category & Status Filter Bar */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          border: '1px solid var(--slate-200)',
          marginBottom: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {/* Category Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-400)', textTransform: 'uppercase', marginRight: '0.25rem' }}>
              Department:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: selectedCategoryFilter === cat ? 700 : 500,
                  background: selectedCategoryFilter === cat ? 'var(--primary)' : 'var(--slate-100)',
                  color: selectedCategoryFilter === cat ? '#ffffff' : 'var(--slate-700)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Pills */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--slate-100)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-400)', textTransform: 'uppercase', marginRight: '0.25rem' }}>
                Status:
              </span>
              {['All', 'Pending', 'In Progress', 'Resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedFilter(st)}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: selectedFilter === st ? 700 : 500,
                    background: selectedFilter === st ? 'var(--slate-900)' : 'transparent',
                    color: selectedFilter === st ? '#ffffff' : 'var(--slate-600)',
                    border: selectedFilter === st ? 'none' : '1px solid var(--slate-200)',
                    cursor: 'pointer',
                  }}
                >
                  {st}
                </button>
              ))}
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)', fontWeight: 600 }}>
              Showing <strong>{filteredList.length}</strong> audited tickets in <strong>{selectedVillage}</strong>
            </div>
          </div>
        </div>

        {/* Expandable Tickets List */}
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-400)' }}>
            Connecting to Panchayat ledger...
          </div>
        ) : filteredList.length === 0 ? (
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-md)',
            padding: '3rem',
            textAlign: 'center',
            border: '1px solid var(--slate-200)'
          }}>
            <CheckCircle2 size={42} color="var(--emerald-600)" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>No grievances in this view</h4>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem' }}>
              All issues in this category are resolved or none have been logged yet.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredList.map((ticket) => (
              <ExpandableTicketCard 
                key={ticket.id || ticket._id} 
                ticket={ticket} 
                onStatusUpdate={loadComplaints}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. MODAL: REGISTER CIVIC GRIEVANCE */}
      {showSubmitModal && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal-card" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={22} color="var(--primary)" />
                <h3 style={{ fontSize: '1.3rem' }}>File Gramin Grievance</h3>
              </div>
              <button 
                className="modal-close-btn" 
                style={{ position: 'static' }} 
                onClick={() => setShowSubmitModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Your issue will be audited and dispatched to the designated Panchayat department with an SMS receipt.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.3rem' }}>
                  Problem Title / Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken water pipe leaking near Primary School"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.3rem' }}>
                    Department / Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--slate-300)',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="Water Supply">💧 Water Supply</option>
                    <option value="Electricity">⚡ Electricity & Transformer</option>
                    <option value="Roads & Transport">🚜 Roads & Transport</option>
                    <option value="Sanitation & Waste">🧹 Sanitation & Waste</option>
                    <option value="Healthcare">🩺 Public Healthcare</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.3rem' }}>
                    Urgency Priority *
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--slate-300)',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="Critical">🔴 Critical (Hazard / Complete Cutoff)</option>
                    <option value="High">🟠 High (Impacting multiple households)</option>
                    <option value="Medium">🟡 Medium (General repair)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.3rem' }}>
                  Exact Village Location & Landmark *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ward No. 3, Near Primary School Gate 2, Rampur"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.3rem' }}>
                  Mobile Number (For Live SMS Updates) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.3rem' }}>
                  Detailed Description & Evidence *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the issue, when it started, how many families are affected, and any safety hazards..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowSubmitModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={isSubmitting}
                >
                  <Send size={15} />
                  <span>{isSubmitting ? 'Logging Ticket...' : 'Submit Grievance & Dispatch SMS'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
