import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PatientView.css';

const PatientView = () => {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [_, setShowRescheduleModal] = useState(false);

  // Mock appointment data
  const appointment = {
    id: '1',
    date: '2024-02-15',
    time: '11:00 AM',
    doctor: 'Dr. Michael Chen',
    office: 'Main Street Medical Center',
    address: '123 Main Street, Suite 200',
    careGap: 'Annual Physical',
    status: 'Pending Confirmation'
  };

  const handleConfirm = () => {
    setShowConfirmModal(true);
    // In a real app, this would make an API call
    setTimeout(() => {
      setShowConfirmModal(false);
      alert('Appointment confirmed!');
    }, 2000);
  };

  const handleReschedule = () => {
    setShowRescheduleModal(true);
  };

  const handleContactCoordinator = () => {
    // In a real app, this would open a contact form or messaging interface
    alert('Contacting your care coordinator...');
  };

  return (
    <div className="patient-view">
      <header className="patient-header">
        <div className="header-content">
          <div className="logo-container">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill="#4A90E2"/>
              <path d="M24 12L32 20H28V28H20V20H16L24 12Z" fill="white"/>
              <path d="M16 32H32V36H16V32Z" fill="white"/>
            </svg>
            <span className="logo-text">CareLink</span>
          </div>
          <button 
            className="btn btn-ghost logout-btn"
            onClick={() => navigate('/')}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="patient-main">
        <div className="patient-container">
          <div className="welcome-section">
            <h1>Welcome, Sarah</h1>
            <p className="welcome-subtitle">Manage your healthcare appointments</p>
          </div>

          <div className="appointment-card-large">
            <div className="card-header">
              <h2>Upcoming Appointment</h2>
              <span className="badge badge-warning">{appointment.status}</span>
            </div>

            <div className="appointment-details">
              <div className="detail-row">
                <div className="detail-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="detail-content">
                  <div className="detail-label">Date & Time</div>
                  <div className="detail-value">
                    {new Date(appointment.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })} at {appointment.time}
                  </div>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="detail-content">
                  <div className="detail-label">Doctor</div>
                  <div className="detail-value">{appointment.doctor}</div>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="detail-content">
                  <div className="detail-label">Office</div>
                  <div className="detail-value">{appointment.office}</div>
                  <div className="detail-address">{appointment.address}</div>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="detail-content">
                  <div className="detail-label">Care Gap</div>
                  <div className="detail-value">{appointment.careGap}</div>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                className="btn btn-primary action-btn"
                onClick={handleConfirm}
                disabled={showConfirmModal}
              >
                {showConfirmModal ? (
                  <>
                    <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Confirming...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Confirm
                  </>
                )}
              </button>
              <button 
                className="btn btn-outline action-btn"
                onClick={handleReschedule}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Reschedule
              </button>
              <button 
                className="btn btn-ghost action-btn"
                onClick={handleContactCoordinator}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Contact Coordinator
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientView;



