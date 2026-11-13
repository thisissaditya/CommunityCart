import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, CheckCircle2, Clock, Phone, Send, AlertTriangle, 
  MapPin, Volume2, ShieldCheck, UserCheck, Play, Pause, Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ExpandableTicketCard({ ticket, onStatusUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(60);
  const { triggerSmsAlert, showToast } = useApp();

  const toggleAudio = (e) => {
    e.stopPropagation();
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      showToast('Playing recorded voice note from Lineman');
    }
  };

  const handleCallOfficer = (e) => {
    e.stopPropagation();
    const officerName = ticket.officer || ticket.assignedOfficer || 'Panchayat Officer';
    const officerPhone = ticket.officerPhone || '+91 94123 45678';
    showToast(`Connecting hotline to ${officerName} (${officerPhone})...`, 'info');
  };

  const handleRequestSmsDispatch = (e) => {
    e.stopPropagation();
    triggerSmsAlert({
      phone: ticket.citizenPhone || '+91 94110 99887',
      title: 'Urgent Dispatch Escalation',
      message: `Priority alert escalated for Grievance #${ticket.id || ticket._id}. Junior Engineer & Panchayat team dispatched to site.`,
    });
    showToast('Urgent SMS dispatched to citizen & field officer!');
  };

  // Derive standardized values from ticket object
  const ticketId = ticket.ticketId || ticket.id || (ticket._id ? `CMP-${ticket._id.slice(-4).toUpperCase()}` : 'CMP-101');
  const affectedCount = ticket.affectedCount || 18;
  const dateFormatted = ticket.date || (ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Sept 16, 2026');
  const fullDescription = ticket.fullDescription || ticket.description || 'Civic infrastructure defect reported by village resident requiring urgent inspection.';
  const loggedBy = ticket.loggedBy || ticket.citizenName || 'Resident Villager';
  const officer = ticket.officer || ticket.assignedOfficer || 'Er. Rajesh Mishra (Jal Sansthan)';
  const evidenceImage = ticket.evidenceImage || (ticket.category?.includes('Water') 
    ? 'https://images.unsplash.com/photo-1541888946425-d0fbb18f1564?w=400&auto=format&fit=crop&q=80' 
    : ticket.category?.includes('Road') 
    ? 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&auto=format&fit=crop&q=80' 
    : 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&auto=format&fit=crop&q=80');
  const gpsCoords = ticket.gpsCoordinates || '25.3214° N, 82.9871° E';
  const slaTarget = ticket.slaTarget || (ticket.priority === 'Critical' ? 'Within 4 Hours' : ticket.priority === 'High' ? 'Within 12 Hours' : 'Within 24 Hours');

  // Stages calculation based on ticket.status
  const isResolved = ticket.status === 'Resolved';
  const isInProgress = ticket.status === 'In Progress';
  const stages = ticket.stages || [
    { label: 'Grievance Logged', time: '10:15 AM', completed: true },
    { label: 'Panchayat Review', time: '11:45 AM', completed: true },
    { label: 'Field Inspection', time: isInProgress || isResolved ? '02:30 PM' : 'Pending', completed: isResolved, current: isInProgress },
    { label: 'Resolution Completed', time: isResolved ? '04:15 PM' : 'Pending', completed: isResolved, current: false },
  ];

  return (
    <motion.div 
      layout
      transition={{ layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
      className={`rounded-2xl border transition-all duration-300 bg-white ${
        isExpanded 
          ? 'border-orange-500 shadow-md ring-1 ring-orange-500/20' 
          : 'border-stone-200/80 hover:border-orange-300 hover:shadow-sm'
      }`}
    >
      {/* 1. Brief / Compact Header (Always Visible) */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
              {ticketId}
            </span>
            <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              {ticket.category}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
              isResolved 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : isInProgress 
                ? 'bg-sky-50 text-sky-700 border-sky-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              • {ticket.status}
            </span>
            {ticket.priority && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                ticket.priority === 'Critical' 
                  ? 'bg-red-50 text-red-600 border border-red-200' 
                  : ticket.priority === 'High' 
                  ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                  : 'bg-stone-50 text-stone-600 border border-stone-200'
              }`}>
                {ticket.priority} Priority
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-stone-900 hover:text-orange-600 transition-colors">
            {ticket.title}
          </h3>

          <div className="flex items-center gap-3 text-xs text-stone-500 mt-1 flex-wrap">
            <span className="flex items-center gap-1">📍 {ticket.location}</span>
            <span>•</span>
            <span>{affectedCount} Families Affected</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {dateFormatted}</span>
          </div>
        </div>

        {/* Toggle Button with Rotating Chevron */}
        <div className="flex items-center justify-end">
          <button 
            type="button"
            className="flex items-center gap-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-orange-50 hover:text-orange-700 px-3.5 py-2 rounded-xl transition-all"
          >
            <span>{isExpanded ? 'Hide Details' : 'View Full Audit & Evidence'}</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </button>
        </div>
      </div>

      {/* 2. Smooth Animated Expanded Section */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-stone-100 bg-stone-50/60"
          >
            <div className="p-6 space-y-6">
              {/* Detailed Description */}
              <div className="bg-white p-4 rounded-xl border border-stone-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-500 tracking-wider uppercase">
                    Incident Audit Report
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                    ticket.priority === 'Critical' 
                      ? 'text-red-600 bg-red-50 border-red-200' 
                      : 'text-amber-700 bg-amber-50 border-amber-200'
                  }`}>
                    {ticket.priority === 'Critical' ? 'Critical Urgency Flagged' : 'High Urgency Flagged'}
                  </span>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {fullDescription}
                </p>
                <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-4 text-xs text-stone-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <UserCheck size={14} className="text-stone-400" /> Logged by: <strong>{loggedBy}</strong>
                  </span>
                  <span>•</span>
                  <span>Assigned Officer: <strong className="text-orange-700">{officer}</strong></span>
                  <span>•</span>
                  <span>Village Ward: <strong>{ticket.village || 'Rampur Panchayat'}</strong></span>
                </div>
              </div>

              {/* 4-Stage Resolution Pipeline Audit */}
              <div className="bg-white p-4 rounded-xl border border-stone-200/80">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">
                  Resolution Pipeline Audit ({isResolved ? 'Stage 4 of 4: Completed' : isInProgress ? 'Stage 3 of 4: In Progress' : 'Stage 1 of 4: Initiated'})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {stages.map((stg, i) => (
                    <div key={i} className={`p-3 rounded-lg border text-center transition-all ${
                      stg.completed 
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800' 
                        : stg.current 
                          ? 'bg-orange-50 border-orange-300 text-orange-900 ring-2 ring-orange-500/20' 
                          : 'bg-stone-50 border-stone-200 text-stone-400'
                    }`}>
                      <div className="font-bold text-xs">{stg.label}</div>
                      <div className="text-[10px] mt-0.5">{stg.time || 'Pending'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Field Audio Voice Note & Evidence Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-stone-200/80 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 size={16} className="text-orange-600" />
                    <span className="text-xs font-bold text-stone-800">Field Voice Note from Lineman / Ground Staff</span>
                  </div>
                  <div className="bg-stone-100 p-2.5 rounded-lg flex items-center gap-3">
                    <button 
                      onClick={toggleAudio}
                      className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xs hover:bg-orange-700 transition"
                      title={isPlayingAudio ? 'Pause Voice Note' : 'Play Voice Note'}
                    >
                      {isPlayingAudio ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                    </button>
                    <div className="flex-1">
                      <div className="h-1.5 bg-stone-300 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-600 transition-all duration-300" 
                          style={{ width: isPlayingAudio ? '85%' : `${audioProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                        <span>{isPlayingAudio ? '0:35' : '0:24'}</span>
                        <span>0:42</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-stone-500 italic mt-2">
                    "{ticket.voiceNoteText || 'Technical inspection complete. Repair crew is on site with materials.'}"
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200/80 flex items-center gap-3">
                  <img 
                    src={evidenceImage} 
                    alt="Geotagged proof" 
                    className="w-24 h-20 object-cover rounded-lg border border-stone-200 flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                      GPS Tag Verified
                    </span>
                    <p className="text-xs font-mono text-stone-600 mt-1">{gpsCoords}</p>
                    <p className="text-[11px] text-stone-400">Captured at site via Gramin App</p>
                  </div>
                </div>
              </div>

              {/* Quick Officer Escalation Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex gap-2 flex-wrap">
                  <button 
                    onClick={handleCallOfficer}
                    className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 transition"
                  >
                    <Phone size={14} /> Call {officer.split(' ')[0]} {officer.split(' ')[1] || 'Officer'}
                  </button>
                  <button 
                    onClick={handleRequestSmsDispatch}
                    className="flex items-center gap-1.5 px-4 py-2 bg-orange-100 text-orange-800 text-xs font-bold rounded-xl hover:bg-orange-200 transition"
                  >
                    <Send size={14} /> Request Urgent SMS Dispatch
                  </button>
                </div>
                <span className="text-xs text-stone-500 font-medium">
                  SLA Target: <strong>{slaTarget}</strong>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
