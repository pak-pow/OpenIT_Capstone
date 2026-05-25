import React, { useState, useMemo } from 'react';
import { Search, ArrowLeft, Filter } from 'lucide-react';
import { useScholarships } from '../../context/ScholarshipContext';
import ApplyModal from './ApplyModal';

const getMatchClass = (pct) => {
  if (pct >= 85) return '';               // green
  if (pct >= 60) return 'match-badge-medium'; // blue
  return 'match-badge-low';              // gray
};

const AllScholarshipsView = ({ onBack, addToast }) => {
  const { scholarships, hasApplied, applyToScholarship } = useScholarships();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  // Derive unique provider types for the dropdown
  const types = ['All', ...new Set(scholarships.map(s => s.type))];

  // Filter scholarships based on search term and type
  const filteredScholarships = useMemo(() => {
    return scholarships.filter((s) => {
      const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.provider.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || s.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [scholarships, searchTerm, filterType]);

  const handleConfirmApply = () => {
    const success = applyToScholarship(selectedScholarship);
    if (success) {
      addToast(`Successfully applied to "${selectedScholarship.title}"!`, 'success');
    } else {
      addToast(`You already applied to "${selectedScholarship.title}".`, 'error');
    }
    setSelectedScholarship(null);
  };

  return (
    <div className="all-scholarships-view">
      <div className="all-scholarships-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="filter-controls">
          <div className="search-input-wrapper">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search programs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-select-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--text-light)" />
            <select 
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {types.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredScholarships.length === 0 ? (
        <div className="no-applications">
          <Search size={32} />
          <p>No scholarships found matching your criteria.</p>
        </div>
      ) : (
        <div className="all-cards-grid">
          {filteredScholarships.map((s) => {
            const applied = hasApplied(s.id);
            const match = s.matchPercentage;

            return (
              <div key={s.id} className="card scholarship-card" style={{ maxWidth: '100%' }}>
                <div className="card-top">
                  <span className={`match-badge ${getMatchClass(match)}`}>
                    {match}% Match
                  </span>
                  <span className="scholarship-type-tag">{s.type}</span>
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
                    <span className="meta-value">{s.slots} available</span>
                  </div>
                </div>
                <button
                  className="btn btn-primary btn-full"
                  disabled={applied}
                  onClick={() => !applied && setSelectedScholarship(s)}
                >
                  {applied ? 'Already Applied' : 'Apply Now'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      {selectedScholarship && (
        <ApplyModal
          scholarship={selectedScholarship}
          onConfirm={handleConfirmApply}
          onClose={() => setSelectedScholarship(null)}
        />
      )}
    </div>
  );
};

export default AllScholarshipsView;
