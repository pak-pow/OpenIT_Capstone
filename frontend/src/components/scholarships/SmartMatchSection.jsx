import React, { useState } from 'react';
import { useScholarships } from '../../context/ScholarshipContext';
import ApplyModal from './ApplyModal';

const getMatchClass = (pct) => {
  if (pct >= 85) return '';               // green
  if (pct >= 60) return 'match-badge-medium'; // blue
  return 'match-badge-low';              // gray
};

const SmartMatchSection = ({ onApply }) => {
  const { scholarships, hasApplied, applyToScholarship } = useScholarships();
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  const handleConfirmApply = () => {
    const success = applyToScholarship(selectedScholarship);
    setSelectedScholarship(null);
    if (onApply) onApply(selectedScholarship, success);
  };

  return (
    <>
      <section className="smart-match-section">
        <div className="section-header-row">
          <h3 className="section-title">Recommended for You</h3>
          <button className="see-all-link">See All ({scholarships.length})</button>
        </div>

        <div className="cards-scroll-wrapper">
          <div className="cards-container">
            {scholarships.map((s) => {
              const applied = hasApplied(s.id);
              const match = s.matchPercentage;

              return (
                <div key={s.id} className="card scholarship-card">
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
        </div>
      </section>

      {/* Apply Modal */}
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
