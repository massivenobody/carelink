import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleLogin = () => {
    if (selectedRole === 'coordinator') {
      navigate('/coordinator');
    } else if (selectedRole === 'provider') {
      navigate('/provider');
    } else if (selectedRole === 'patient') {
      navigate('/patient');
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-header">
          <div className="logo-container">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill="#4A90E2"/>
              <path d="M24 12L32 20H28V28H20V20H16L24 12Z" fill="white"/>
              <path d="M16 32H32V36H16V32Z" fill="white"/>
            </svg>
            <h1 className="logo-text">CareLink</h1>
          </div>
          <p className="tagline">Connecting patients, coordinators, and providers</p>
        </div>

        <div className="login-section">
          <h2 className="login-title">Select Your Role</h2>
          
          <div className="role-cards">
            <button
              className={`role-card ${selectedRole === 'coordinator' ? 'selected' : ''}`}
              onClick={() => handleRoleSelect('coordinator')}
              aria-label="Login as Care Coordinator"
            >
              <div className="role-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>Care Coordinator</h3>
              <p>Manage patient appointments and coordinate care</p>
            </button>

            <button
              className={`role-card ${selectedRole === 'provider' ? 'selected' : ''}`}
              onClick={() => handleRoleSelect('provider')}
              aria-label="Login as Provider"
            >
              <div className="role-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h3>Provider (PCP)</h3>
              <p>View schedule and manage patient appointments</p>
            </button>

            <button
              className={`role-card ${selectedRole === 'patient' ? 'selected' : ''}`}
              onClick={() => handleRoleSelect('patient')}
              aria-label="Login as Patient"
            >
              <div className="role-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3>Patient</h3>
              <p>View and manage your appointments</p>
            </button>
          </div>

          <button
            className="btn btn-primary login-btn"
            onClick={handleLogin}
            disabled={!selectedRole}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;




