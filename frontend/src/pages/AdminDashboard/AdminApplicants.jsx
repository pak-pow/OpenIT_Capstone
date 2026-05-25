import React from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import DataTable from './components/DataTable';

const AdminApplicants = ({ addToast }) => (
  <>
    <SectionHeader title="Applicant Tracking" />
    <DataTable addToast={addToast} />
  </>
);

export default AdminApplicants;
