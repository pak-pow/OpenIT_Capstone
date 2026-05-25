import React from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import { useAdminContext } from '../../context/AdminContext';
import { Users, PhilippinePeso } from 'lucide-react';

const AdminScholarships = ({ setShowCreateProgram }) => {
  const { adminScholarships } = useAdminContext();

  return (
    <>
      <SectionHeader
        title="Manage Scholarships"
        buttonText="Create New Program"
        onButtonClick={() => setShowCreateProgram(true)}
      />
      <div className="card table-container" style={{ marginTop: '1rem' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Program Name</th>
              <th>Type</th>
              <th>Stipend Amount</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {adminScholarships.length > 0 ? (
              adminScholarships.map((s) => (
                <tr key={s.id}>
                  <td className="table-cell-name" style={{ fontWeight: '600' }}>{s.title || s.name}</td>
                  <td>{s.type}</td>
                  <td style={{ color: 'var(--success-text)', fontWeight: '500' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <PhilippinePeso size={14} /> {s.amount}
                    </div>
                  </td>
                  <td>{s.deadline}</td>
                  <td>
                    <span className={`badge ${s.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-review" style={{ opacity: 0.8 }}>Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-medium)' }}>
                  No scholarship programs created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminScholarships;
