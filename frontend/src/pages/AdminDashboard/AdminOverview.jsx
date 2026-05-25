import React from 'react';
import MetricCards from './components/MetricCards';
import SectionHeader from '../../components/common/SectionHeader';
import DataTable from './components/DataTable';

const AdminOverview = ({ setShowCreateProgram, addToast }) => (
  <>
    <SectionHeader
      title="Overview"
      buttonText="Create New Program"
      onButtonClick={() => setShowCreateProgram(true)}
    />
    <MetricCards />
    <SectionHeader title="Recent Applicants" />
    <DataTable addToast={addToast} />
  </>
);

export default AdminOverview;
