import React, { useState, useEffect, useRef } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import SmartMatchSection from '../../components/scholarships/SmartMatchSection';
import ApplicationStatusList from '../../components/scholarships/ApplicationStatusList';
import AllScholarshipsView from '../../components/scholarships/AllScholarshipsView';
import PaldoModal from '../../components/scholarships/PaldoModal';
import NotPaldoModal from '../../components/scholarships/NotPaldoModal';
import ApplyModal from '../../components/scholarships/ApplyModal';
import { useScholarships } from '../../context/ScholarshipContext';
import { useAuth } from '../../context/AuthContext';
import {
  Clock, Award, X, BookOpen, CheckCircle,
  FileText, User, Zap, AlertTriangle, ChevronRight, ChevronLeft, Calendar, Banknote
} from 'lucide-react';
import '../../styles/dashboard.css';

// ─── Helpers ────────────────────────────────────────────────────────────────
const daysUntil = (dateStr) => {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const urgencyDotClass = (days) => {
  if (days <= 14) return 'urgency-dot dot-red';
  if (days <= 30) return 'urgency-dot dot-amber';
  return 'urgency-dot dot-green';
};

// ─── Alert Bar ───────────────────────────────────────────────────────────────
const DeadlineAlertBar = () => {
  const { scholarships } = useScholarships();
  const [dismissed, setDismissed] = useState(false);

  const urgent = scholarships
    .filter(s => daysUntil(s.deadline) > 0 && daysUntil(s.deadline) <= 30)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  if (dismissed || urgent.length === 0) return null;

  const soonest = urgent[0];
  const days = daysUntil(soonest.deadline);

  return (
    <div className={`deadline-alert-bar ${days <= 7 ? 'alert-urgent' : 'alert-warning'}`}>
      <AlertTriangle size={16} className="alert-icon" />
      <span>
        <strong>{soonest.title}</strong> closes in{' '}
        <strong>{days} day{days !== 1 ? 's' : ''}</strong>.
        {urgent.length > 1 && ` (+${urgent.length - 1} more closing soon)`}
      </span>
      <button className="alert-dismiss" onClick={() => setDismissed(true)} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
};

// ─── Welcome Banner ───────────────────────────────────────────────────────────
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

// ─── Quick Actions Panel ──────────────────────────────────────────────────────
const QuickActionsPanel = ({ onSeeAll, onCheckStatus, addToast }) => {
  const actions = [
    {
      icon: <BookOpen size={22} />,
      label: 'Apply for Scholarship',
      desc: 'Browse & apply now',
      onClick: onSeeAll,
      variant: 'qa-navy',
    },
    {
      icon: <FileText size={22} />,
      label: 'Check My Status',
      desc: 'View your applications',
      onClick: onCheckStatus,
      variant: 'qa-gold',
    },
  ];

  return (
    <div className="quick-actions-panel">
      <h3 className="section-title quick-actions-title">Quick Actions</h3>
      <div className="quick-actions-grid">
        {actions.map((a) => (
          <button key={a.label} className={`qa-tile ${a.variant}`} onClick={a.onClick}>
            <div className="qa-icon">{a.icon}</div>
            <div className="qa-text">
              <span className="qa-label">{a.label}</span>
              <span className="qa-desc">{a.desc}</span>
            </div>
            <ChevronRight size={16} className="qa-arrow" />
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Active Scholarship Widget ────────────────────────────────────────────────
const CurrentScholarshipWidget = ({ application }) => {
  const appliedDate = new Date(application.dateApplied);
  const renewalDate = new Date(appliedDate);
  renewalDate.setMonth(renewalDate.getMonth() + 6);
  const renewalStr = renewalDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="current-scholarship-widget">
      <div className="widget-header">
        <div className="widget-icon-wrapper">
          <Award size={24} className="text-golden" />
        </div>
        <div>
          <h3 className="widget-title">My Current Scholarship</h3>
          <span className="badge badge-success">Active Scholar</span>
        </div>
      </div>
      <div className="widget-body">
        <h4>{application.scholarshipName}</h4>
        <p className="provider">{application.provider}</p>

        <div className="meta-info">
          <div className="meta-item">
            <span className="label">Amount</span>
            <span className="value">{application.amount}</span>
          </div>
          <div className="meta-item">
            <span className="label">Status</span>
            <span className="value" style={{ color: '#059669' }}>Approved</span>
          </div>
            <div className="meta-item">
              <span className="label">Next Renewal</span>
              <span className="value">{renewalStr}</span>
            </div>
        </div>

        <p className="payment-inline-note">
          Your {application.amount} grant will be disbursed within <strong>30 working days</strong> after approval
          {application.schoolName ? ` to your registered account at ${application.schoolName}` : ' to your registered school account'}.
        </p>
      </div>
    </div>
  );
};

// ─── Featured Scholarships (no active scholar) ────────────────────────────────────
const FeaturedScholarshipsWidget = ({ onApply }) => {
  const { scholarships, applications, applyToScholarship } = useScholarships();
  const [selected, setSelected] = useState(null);

  // IDs of scholarships the user already interacted with (any status)
  const appliedIds = new Set(applications.map(a => a.scholarshipId));

  const featured = scholarships
    .filter(s => new Date(s.deadline) > new Date() && !appliedIds.has(s.id))
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 2);

  if (featured.length === 0) return null;

  const handleConfirm = () => {
    const success = applyToScholarship(selected);
    if (onApply) onApply(selected, success);
    setSelected(null);
  };

  return (
    <>
      <div className="featured-widget-container">
        <h3 className="section-title" style={{ marginBottom: '14px' }}>Urgent Opportunities</h3>
        <div className="featured-grid">
          {featured.map(s => {
            const days = daysUntil(s.deadline);
            return (
              <div
                key={s.id}
                className="featured-card"
                onClick={() => setSelected(s)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelected(s)}
              >
                <div className="featured-top">
                  <span className={`type-tag type-${s.type.toLowerCase().replace('/', '').replace(' ', '-')}`} style={{ fontSize: '0.7rem' }}>{s.type}</span>
                  <span className="urgent-badge">{days}d left</span>
                </div>
                <h4>{s.title}</h4>
                <div className="featured-footer">
                  <span className="featured-amount">{s.amount}</span>
                  <span className="featured-deadline">Due {s.deadline}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selected && (
        <ApplyModal
          scholarship={selected}
          onConfirm={handleConfirm}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
};


// ─── What To Do Next Checklist ────────────────────────────────────────────────
const NextStepsChecklist = ({ onSeeAll }) => {
  const steps = [
    { icon: <BookOpen size={16} />, label: 'Browse available scholarships', desc: 'Explore government, barangay, and private grants.', action: onSeeAll, actionLabel: 'Browse →' },
    { icon: <FileText size={16} />, label: 'Submit your application', desc: 'Apply to scholarships that match your profile.' },
    { icon: <CheckCircle size={16} />, label: 'Track your application', desc: 'Monitor status updates in My Applications below.' },
  ];

  return (
    <div className="checklist-card">
      <div className="checklist-header">
        <Zap size={18} className="checklist-icon" />
        <h3>What To Do Next</h3>
      </div>
      <div className="checklist-steps">
        {steps.map((step, i) => (
          <div key={i} className="checklist-step">
            <div className="step-number">{i + 1}</div>
            <div className="step-body">
              <div className="step-label">
                {step.icon}
                <span>{step.label}</span>
                {step.action && (
                  <button className="step-action-link" onClick={step.action}>
                    {step.actionLabel}
                  </button>
                )}
              </div>
              <p className="step-desc">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Dashboard Sidebar ────────────────────────────────────────────────────────
const DashboardSidebar = () => {
  const { scholarships } = useScholarships();
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  // All future deadlines (for calendar dots)
  const allUpcoming = [...scholarships]
    .filter(s => daysUntil(s.deadline) > 0)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  // Only deadlines IN the currently viewed month
  const monthDeadlines = allUpcoming.filter(s => {
    const d = new Date(s.deadline);
    return d.getMonth() === calMonth && d.getFullYear() === calYear;
  });

  // Build calendar days for current calMonth/calYear
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calDays = Array.from({ length: firstDay }, () => null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const deadlineDays = scholarships.reduce((acc, s) => {
    const d = new Date(s.deadline);
    if (d.getMonth() === calMonth && d.getFullYear() === calYear) {
      const day = d.getDate();
      const days = daysUntil(s.deadline);
      acc[day] = days <= 14 ? 'dot-red' : days <= 30 ? 'dot-amber' : 'dot-green';
    }
    return acc;
  }, {});

  const monthName = new Date(calYear, calMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  return (
    <div className="dashboard-side">
      <div className="sidebar-widget">
        {/* Mini Calendar */}
        <div className="mini-cal-header">
          <button className="cal-nav-btn" onClick={prevMonth}><ChevronLeft size={15} /></button>
          <span className="cal-month-label">{monthName}</span>
          <button className="cal-nav-btn" onClick={nextMonth}><ChevronRight size={15} /></button>
        </div>
        <div className="mini-cal-grid">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} className="cal-day-head">{d}</div>
          ))}
          {calDays.map((day, i) => (
            <div
              key={i}
              className={[
                'cal-day-cell',
                !day ? 'cal-empty' : '',
                day && today.getDate() === day && today.getMonth() === calMonth && today.getFullYear() === calYear ? 'cal-today' : '',
                day && deadlineDays[day] ? 'cal-has-event' : '',
              ].join(' ')}
            >
              {day || ''}
              {day && deadlineDays[day] && (
                <span className={`cal-event-dot ${deadlineDays[day]}`} />
              )}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="cal-legend">
          <span><span className="urgency-dot dot-red" />Urgent (&lt;14d)</span>
          <span><span className="urgency-dot dot-amber" />Soon</span>
          <span><span className="urgency-dot dot-green" />Upcoming</span>
        </div>

        <div className="cal-divider" />

        {/* Deadline List — filtered to current viewed month */}
        <div className="widget-header-small" style={{ marginBottom: '12px', borderBottom: 'none', paddingBottom: 0 }}>
          <Clock size={16} />
          <h4>Deadlines in {new Date(calYear, calMonth).toLocaleDateString('en-US', { month: 'long' })}</h4>
          {monthDeadlines.length > 0 && (
            <span className="deadline-count">{monthDeadlines.length}</span>
          )}
        </div>

        <div className="timeline-list">
          {monthDeadlines.length === 0 ? (
            <p className="no-deadlines">No deadlines this month.</p>
          ) : (
            monthDeadlines.map(s => {
              const days = daysUntil(s.deadline);
              const d = new Date(s.deadline);
              return (
                <div key={s.id} className="deadline-list-item">
                  <div className="deadline-date-badge">
                    <span className="ddate-month">{d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span>
                    <span className="ddate-day">{d.getDate()}</span>
                  </div>
                  <div className="deadline-info">
                    <div className="deadline-name">{s.title}</div>
                    <div className="deadline-tags">
                      <span className={`days-pill ${days <= 14 ? 'pill-urgent' : days <= 30 ? 'pill-warn' : 'pill-ok'}`}>
                        {days}d left
                      </span>
                      <span className={`type-tag type-${s.type.toLowerCase().replace('/', '').replace(' ', '-')}`}>{s.type}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const UserDashboard = ({ addToast }) => {
  const [view, setView] = useState('dashboard');
  const statusRef = useRef(null);
  const { applications, activeScholarship, simulateApproval, simulateRejection, clearJustApproved, clearJustRejected } = useScholarships();

  const approvedApp = applications.find(a => a.justApproved);
  const rejectedApp = applications.find(a => a.justRejected);
  const hasNoApplications = applications.length === 0;

  useEffect(() => {
    const onKey = (e) => {
      if (e.shiftKey) {
        if (e.key === '3' || e.key === '#') simulateApproval();
        else if (e.key === '4' || e.key === '$') simulateRejection();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [simulateApproval, simulateRejection]);

  const handleApply = (scholarship, result) => {
    if (result === 'active_scholar') {
      addToast(`You already have an active scholarship (${activeScholarship?.scholarshipName}). Only one is allowed at a time.`, 'error');
      return;
    }
    if (result === true) addToast(`Successfully applied to "${scholarship.title}"!`, 'success');
    else addToast(`You already applied to "${scholarship.title}".`, 'error');
  };

  const scrollToStatus = () => {
    if (statusRef.current) {
      statusRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <StudentLayout view={view} setView={setView}>
      {approvedApp && (
        <PaldoModal application={approvedApp} onClose={() => clearJustApproved(approvedApp.id)} />
      )}
      {rejectedApp && (
        <NotPaldoModal application={rejectedApp} onClose={() => clearJustRejected(rejectedApp.id)} />
      )}

      {view === 'dashboard' ? (
        <>
          <DeadlineAlertBar />
          <div className="dashboard-layout">
            <div className="dashboard-main">
              <WelcomeBanner />
              <QuickActionsPanel
                onSeeAll={() => setView('all')}
                onCheckStatus={scrollToStatus}
                addToast={addToast}
              />

              {activeScholarship ? (
                <CurrentScholarshipWidget application={activeScholarship} />
              ) : (
                <>
                  <FeaturedScholarshipsWidget onApply={handleApply} />
                  {hasNoApplications && <NextStepsChecklist onSeeAll={() => setView('all')} />}
                </>
              )}

              <SmartMatchSection
                onSeeAll={() => setView('all')}
                onApply={handleApply}
                disabled={!!activeScholarship}
              />

              <div ref={statusRef}>
                <ApplicationStatusList />
              </div>
            </div>

            <DashboardSidebar />
          </div>
        </>
      ) : (
        <AllScholarshipsView
          onBack={() => setView('dashboard')}
          addToast={addToast}
          disabled={!!activeScholarship}
        />
      )}
    </StudentLayout>
  );
};

export default UserDashboard;
