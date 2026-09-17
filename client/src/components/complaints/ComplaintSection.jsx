import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchComplaints, postComplaint } from '../../services/api';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  PlusCircle, 
  MapPin, 
  Send, 
  ShieldAlert, 
  Filter, 
  UserCheck, 
  Phone
} from 'lucide-react';

export const ComplaintSection = () => {
  const { selectedVillage, currentUser, showToast } = useApp();

  const [complaints, setComplaints] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Roads & Transport');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [citizenPhone, setCitizenPhone] = useState(currentUser?.phone || '');

  const categories = [
    'Roads & Transport',
    'Water Supply',
    'Electricity',
    'Sanitation & Waste',
    'Healthcare',
    'Public Safety'
  ];

  const loadComplaints = async () => {
    setLoading(true);
    const data = await fetchComplaints(selectedFilter);
    setComplaints(data);
    setLoading(false);
  };

  useEffect(() => {
    loadComplaints();
  }, [selectedFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !location) {
      showToast('Please fill all mandatory fields', 'error');
      return;
    }

    const payload = {
      title,
      category,
      description,
      location,
      priority,
      village: selectedVillage,
      citizenName: currentUser?.name || 'Citizen Resident',
      citizenPhone: citizenPhone || '9876543210',
    };

    const res = await postComplaint(payload);
    if (res.success) {
      showToast('Grievance registered! Panchayat team notified.');
      setShowSubmitModal(false);
      setTitle('');
      setDescription('');
      setLocation('');
      loadComplaints();
    } else {
      showToast(res.message || 'Failed to submit complaint', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return (
          <span className="status-badge resolved">
            <CheckCircle size={12} /> Resolved
          </span>
        );
      case 'in progress':
        return (
          <span className="status-badge in-progress">
            <Clock size={12} /> In Progress
          </span>
        );
      default:
        return (
          <span className="status-badge pending">
            <AlertCircle size={12} /> Pending Review
          </span>
        );
    }
  };

  return (
    <div style={{ margin: '2rem 0' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ maxWidth: '650px' }}>
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
            Civic Transparency & Public Accountability
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
            Gram Panchayat Grievance & Civic Portal
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Report road damages, drinking water pipeline leaks, electricity outages, or sanitation issues. 
            All submissions are routed directly to village administration officers with publicly trackable resolution timelines.
          </p>
        </div>

        <button 
          className="btn-primary"
          style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
          onClick={() => setShowSubmitModal(true)}
        >
          <PlusCircle size={18} />
          Register Civic Grievance
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="filter-tabs-row" style={{ margin: 0 }}>
          {['All', 'Pending', 'In Progress', 'Resolved'].map((status) => (
            <button
              key={status}
              className={`filter-pill ${selectedFilter === status ? 'active' : ''}`}
              onClick={() => setSelectedFilter(status)}
            >
              <Filter size={13} />
              {status} Issues
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600 }}>
          Showing <strong>{complaints.length}</strong> reported issues in <strong>{selectedVillage}</strong>
        </div>
      </div>

      {/* Complaints Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {complaints.map((item) => (
          <div key={item.id} style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--slate-200)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
              <span style={{
                background: 'var(--slate-100)',
                color: 'var(--slate-700)',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-pill)',
                textTransform: 'uppercase'
              }}>
                {item.category}
              </span>
              {getStatusBadge(item.status)}
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              {item.title}
            </h3>

            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
              {item.description}
            </p>

            <div style={{
              background: 'var(--slate-50)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: 'var(--slate-600)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={14} color="var(--primary)" />
                <strong>Location:</strong> {item.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <UserCheck size={14} color="var(--emerald-600)" />
                <strong>Assigned To:</strong> {item.assignedOfficer || 'Panchayat Seva Officer'}
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--slate-400)',
              borderTop: '1px dashed var(--slate-200)',
              paddingTop: '0.65rem',
              marginTop: 'auto'
            }}>
              <span>Reported by: <strong>{item.citizenName}</strong></span>
              <span>Priority: <strong style={{ color: item.priority === 'Critical' ? 'var(--emergency)' : 'inherit' }}>{item.priority}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Submission Modal */}
      {showSubmitModal && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>Register Civic Grievance</h3>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Your report will be forwarded directly to the Gram Panchayat Seva Kendra.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                  Issue Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.9rem'
                  }}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                  Title / Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Drinking water pipeline leak on Main Road"
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

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide specifics like duration of problem, affected houses, or safety risks..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.9rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Specific Location / Pole No. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ward 4, near temple"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--slate-300)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Urgency / Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--slate-300)',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical (Hazard)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                  Contact Phone (For SMS Updates)
                </label>
                <input
                  type="tel"
                  placeholder="10 digit mobile number"
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowSubmitModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Send size={16} />
                  Submit Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
