import React, { useState } from 'react';
import { useAdminContext } from '../../context/AdminContext';
import ReviewApplicantModal from './ReviewApplicantModal';

const getBadgeClass = (status) => {
  switch (status) {
    case 'Approved':     return 'badge badge-success';
    case 'Pending':      return 'badge badge-warning';
    case 'Under Review': return 'badge badge-info';
    case 'Rejected':     return 'badge badge-danger';
    default:             return 'badge';
  }
};

const DataTable = ({ addToast }) => {
  const { adminApplicants } = useAdminContext();
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredApplicants = adminApplicants.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input 
          type="text" 
          placeholder="Search applicants or programs..." 
          className="form-input" 
          style={{ flex: 1 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="form-input" 
          style={{ width: '200px' }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Under Review">Under Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="card table-container">
        <table className="data-table">
      <thead>
        <tr>
          <th>Applicant Name</th>
          <th>Scholarship Program</th>
          <th>GPA</th>
          <th>Applied Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredApplicants.length > 0 ? (
          filteredApplicants.map((a) => (
            <tr key={a.id}>
              <td className="table-cell-name">{a.name}</td>
              <td>{a.program}</td>
              <td>{a.gpa}</td>
              <td>{a.appliedDate}</td>
              <td><span className={getBadgeClass(a.status)}>{a.status}</span></td>
              <td>
                <button 
                  className="btn-review" 
                  onClick={() => setSelectedApplicant(a)}
                  disabled={a.status === 'Approved' || a.status === 'Rejected'}
                  style={{ opacity: (a.status === 'Approved' || a.status === 'Rejected') ? 0.5 : 1 }}
                >
                  {a.status === 'Approved' || a.status === 'Rejected' ? 'Reviewed' : 'Review'}
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-medium)' }}>
              No applicants found matching your criteria.
            </td>
          </tr>
        )}
      </tbody>
        </table>
      </div>

      {selectedApplicant && (
        <ReviewApplicantModal 
          applicant={selectedApplicant} 
          onClose={() => setSelectedApplicant(null)} 
          addToast={addToast}
        />
      )}
    </>
  );
};

export default DataTable;
