import React, { useState } from 'react';
import { useScholarships } from '../../context/ScholarshipContext';
import ApplyModal from './ApplyModal';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getMatchClass = (pct) => {
  if (pct >= 85) return '';
  if (pct >= 60) return 'match-badge-medium';
  return 'match-badge-low';
};

const getTypeTagClass = (type) => {
  switch (type) {
    case 'Government': return 'type-tag type-government';
    case 'LGU':        return 'type-tag type-lgu';
    case 'Barangay':   return 'type-tag type-barangay';
    case 'SK':         return 'type-tag type-sk';
    case 'Private/NGO':return 'type-tag type-private';
    case 'CHED':       return 'type-tag type-government';
    default:           return 'type-tag type-default';
  }
};

const FILTER_OPTIONS = ['All', 'Government', 'Barangay & SK', 'Private/NGO'];

const matchesFilter = (type, filter) => {
  if (filter === 'All') return true;
  if (filter === 'Government') return type === 'Government' || type === 'CHED';
  if (filter === 'Barangay & SK') return type === 'Barangay' || type === 'SK' || type === 'LGU';
  if (filter === 'Private/NGO') return type === 'Private/NGO';
  return true;
};

// ─── Component ────────────────────────────────────────────────────────────────
const SmartMatchSection = ({ onApply, onSeeAll, disabled }) => {
  const { scholarships, hasApplied, applyToScholarship } = useScholarships();
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = scholarships.filter(s => matchesFilter(s.type, activeFilter));

  const handleConfirmApply = async () => {
    const success = await applyToScholarship(selectedScholarship);
    setSelectedScholarship(null);
    if (onApply) onApply(selectedScholarship, success);
  };

  return (
    <>
      <section className="smart-match-section">
        {/* Header row */}
        <div className="section-header-row">
          <h3 className="section-title">Recommended for You</h3>
          <button className="see-all-link" onClick={onSeeAll}>
            See All ({scholarships.length})
          </button>
        </div>

        {/* Filter tabs */}
        <div className="scholarship-filter-tabs">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt}
              className={`sfilter-btn ${activeFilter === opt ? 'sfilter-active' : ''}`}
              onClick={() => setActiveFilter(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Cards scroll area */}
        <div className="cards-scroll-wrapper">
          <div className="cards-container">
            {filtered.map((s) => {
              const applied = hasApplied(s.id);
              const match = s.matchPercentage;
              const slotsLow = s.slots < 15;

              return (
                <div key={s.id} className="card scholarship-card">
                  <div className="card-top">
                    <span className={`match-badge ${getMatchClass(match)}`}>
                      {match}% Match
                    </span>
                    <span className={getTypeTagClass(s.type)}>{s.type}</span>
                  </div>
                  <h4 className="scholarship-title">{s.title}</h4>
                  <p className="scholarship-provider">{s.provider}</p>
                  <div className="scholarship-meta">
                    <div className="meta-row">
                      <span className="meta-label">Amount</span>
                      <span className="meta-value meta-amount">{s.amount}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Deadline</span>
                      <span className="meta-value">{s.deadline}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Slots</span>
                      <span className={`meta-value ${slotsLow ? 'slots-low' : 'slots-ok'}`}>
                        {slotsLow ? `⚠ Only ${s.slots} left` : `${s.slots} available`}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-full"
                    disabled={applied || disabled}
                    onClick={() => {
                      if (disabled) {
                        if (onApply) onApply(s, 'active_scholar');
                        return;
                      }
                      if (!applied) setSelectedScholarship(s);
                    }}
                  >
                    {applied ? 'Already Applied' : 'Apply Now'}
                  </button>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <p style={{ color: 'var(--text-light)', padding: '1rem 0' }}>
                No scholarships found for this filter.
              </p>
            )}
          </div>
        </div>
      </section>

      {selectedScholarship && (
        <ApplyModal
          scholarship={selectedScholarship}
          onConfirm={handleConfirmApply}
          onClose={() => setSelectedScholarship(null)}
        />
      )}
    </>
  );
};

export default SmartMatchSection;
