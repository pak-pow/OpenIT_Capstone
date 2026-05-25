import React from 'react';
import SectionHeader from '../../components/common/SectionHeader';

const AdminScholarships = ({ setShowCreateProgram }) => (
  <>
    <SectionHeader
      title="Manage Scholarships"
      buttonText="Create New Program"
      onButtonClick={() => setShowCreateProgram(true)}
    />
    <div className="card">
       <p style={{ color: 'var(--text-medium)', padding: '1rem 0' }}>Scholarship management table goes here.</p>
    </div>
  </>
);

export default AdminScholarships;
