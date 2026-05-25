import React from 'react';
import { applicants } from '../../mockdata';

const getBadgeClass = (status) => {
  switch (status) {
    case 'Approved':     return 'badge badge-success';
    case 'Pending':      return 'badge badge-warning';
    case 'Under Review': return 'badge badge-info';
    default:             return 'badge';
  }
};

const DataTable = () => (
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
        {applicants.map((a) => (
          <tr key={a.id}>
            <td className="table-cell-name">{a.name}</td>
            <td>{a.program}</td>
            <td>{a.gpa}</td>
            <td>{a.appliedDate}</td>
            <td><span className={getBadgeClass(a.status)}>{a.status}</span></td>
            <td><button className="btn-review">Review</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
