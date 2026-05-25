/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import './index.css';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { ScholarshipProvider } from './context/ScholarshipContext';

// Auth Pages
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Login/RegisterPage';
import AdminLoginPage from './pages/Login/AdminLoginPage';

// Student Layout & Components
import StudentLayout from './components/layout/StudentLayout';
import SmartMatchSection from './components/scholarships/SmartMatchSection';
import ApplicationStatusList from './components/scholarships/ApplicationStatusList';
import AllScholarshipsView from './components/scholarships/AllScholarshipsView';
import PaldoModal from './components/scholarships/PaldoModal';
import NotPaldoModal from './components/scholarships/NotPaldoModal';
import { useScholarships } from './context/ScholarshipContext';

// Admin Layout & Components
import AdminLayout from './components/layout/AdminLayout';
import SectionHeader from './components/common/SectionHeader';
import MetricCards from './components/common/MetricCards';
import DataTable from './components/common/DataTable';
import CreateProgramModal from './components/common/CreateProgramModal';
import { AdminProvider } from './context/AdminContext';

// Shared Components
import ToastContainer from './components/common/Toast';

// ======================================================
// Inner App — has access to AuthContext
// ======================================================
const InnerApp = () => {
  const { currentUser } = useAuth();

  // 'login' | 'register' | 'admin-login'
  const [authPage, setAuthPage] = useState('login');

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Secret & Navigation keyboard shortcuts ──────────────────────
  //   Shift + \  (or |) → Secret Admin Login
  //   Shift + 1          → Normal Login
  //   Shift + 2          → Register Page
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only fire when NOT inside an input/textarea/select
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.shiftKey && (e.key === '\\' || e.key === '|')) {
        setAuthPage('admin-login');
      }
      if (e.shiftKey && e.key === '!') {   // Shift+1 = '!'
        setAuthPage('login');
      }
      if (e.shiftKey && e.key === '@') {   // Shift+2 = '@'
        setAuthPage('register');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Admin Modals State ──────────────────────────────────────────
  const [showCreateProgram, setShowCreateProgram] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState('Dashboard');

  // ── If user is logged in → show their dashboard ──────────────────
  if (currentUser) {
    if (currentUser.role === 'admin') {
      return (
        <AdminProvider>
          <AdminLayout activeTab={adminActiveTab} setActiveTab={setAdminActiveTab}>
            
            {adminActiveTab === 'Dashboard' && (
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
            )}

            {adminActiveTab === 'Scholarships' && (
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
            )}

            {adminActiveTab === 'Applicants' && (
              <>
                <SectionHeader title="Applicant Tracking" />
                <DataTable addToast={addToast} />
              </>
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
          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </AdminProvider>
      );
    }

    // Student role
    return (
      <ScholarshipProvider userProfile={currentUser.profile}>
        <StudentDashboard addToast={addToast} />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </ScholarshipProvider>
    );
  }

  // ── Not logged in → show auth pages ──────────────────────────────
  return (
    <>
      {authPage === 'login' && (
        <LoginPage
          onNavigateRegister={() => setAuthPage('register')}
          onNavigateAdminLogin={() => setAuthPage('admin-login')}
        />
      )}
      {authPage === 'register' && (
        <RegisterPage onNavigateLogin={() => setAuthPage('login')} />
      )}
      {authPage === 'admin-login' && (
        <AdminLoginPage onNavigateLogin={() => setAuthPage('login')} />
      )}
    </>
  );
};

const StudentDashboard = ({ addToast }) => {
  const [view, setView] = useState('dashboard');
  const { applications, simulateApproval, simulateRejection, clearJustApproved, clearJustRejected } = useScholarships();

  // Find if any application was just approved or rejected
  const approvedApp = applications.find(a => a.justApproved);
  const rejectedApp = applications.find(a => a.justRejected);

  // Hotkey to simulate approval (Shift + 3) or rejection (Shift + 4) for testing
  useEffect(() => {
    const onKey = (e) => {
      if (e.shiftKey) {
        if (e.key === '3' || e.key === '#') {
          simulateApproval();
        } else if (e.key === '4' || e.key === '$') {
          simulateRejection();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [simulateApproval, simulateRejection]);

  return (
    <StudentLayout>
      {approvedApp && (
        <PaldoModal 
          application={approvedApp} 
          onClose={() => clearJustApproved(approvedApp.id)} 
        />
      )}
      {rejectedApp && (
        <NotPaldoModal 
          application={rejectedApp} 
          onClose={() => clearJustRejected(rejectedApp.id)} 
        />
      )}
      
      {view === 'dashboard' ? (
        <>
          <WelcomeBanner />
          <SmartMatchSection
            onSeeAll={() => setView('all')}
            onApply={(scholarship, success) => {
              if (success) {
                addToast(`Successfully applied to "${scholarship.title}"!`, 'success');
              } else {
                addToast(`You already applied to "${scholarship.title}".`, 'error');
              }
            }}
          />
          <ApplicationStatusList />
        </>
      ) : (
        <AllScholarshipsView 
          onBack={() => setView('dashboard')} 
          addToast={addToast} 
        />
      )}
    </StudentLayout>
  );
};

// ======================================================
// Welcome Banner
// ======================================================
const WelcomeBanner = () => {
  const { currentUser } = useAuth();
  return (
    <div className="dashboard-welcome">
      <h2>
        Welcome,{' '}
        <span className="welcome-highlight">
          {currentUser?.firstName || 'Scholar'}
        </span>!
      </h2>
      <p>
        These scholarships are ranked by how well they match your profile.
        {currentUser?.profile?.course && ` Showing results for ${currentUser.profile.course}.`}
      </p>
    </div>
  );
};

// ======================================================
// Root App — wraps everything in providers
// ======================================================
function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

export default App;
