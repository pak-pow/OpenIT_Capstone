import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import AdminOverview from './AdminOverview';
import AdminScholarships from './AdminScholarships';
import AdminApplicants from './AdminApplicants';
import CreateProgramModal from '../../components/admin/CreateProgramModal';
import { AdminProvider } from '../../context/AdminContext';

const AdminDashboardIndex = ({ addToast }) => {
  const [adminActiveTab, setAdminActiveTab] = useState('Dashboard');
  const [showCreateProgram, setShowCreateProgram] = useState(false);

  return (
    <AdminProvider>
      <AdminLayout activeTab={adminActiveTab} setActiveTab={setAdminActiveTab}>
        
        {adminActiveTab === 'Dashboard' && (
          <AdminOverview 
            setShowCreateProgram={setShowCreateProgram} 
            addToast={addToast} 
          />
        )}

        {adminActiveTab === 'Scholarships' && (
          <AdminScholarships 
            setShowCreateProgram={setShowCreateProgram} 
          />
        )}

        {adminActiveTab === 'Applicants' && (
          <AdminApplicants addToast={addToast} />
        )}

        {['Documents', 'Reports'].includes(adminActiveTab) && (
          <div className="card empty-state">
            <h3>Coming Soon</h3>
            <p>The {adminActiveTab} module is currently under development.</p>
          </div>
        )}
        
        {showCreateProgram && (
          <CreateProgramModal 
            onClose={() => setShowCreateProgram(false)} 
            addToast={addToast} 
          />
        )}
      </AdminLayout>
    </AdminProvider>
  );
};

export default AdminDashboardIndex;
