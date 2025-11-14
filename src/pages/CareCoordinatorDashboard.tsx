import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CareCoordinatorDashboard.css';

interface Patient {
  id: string;
  name: string;
  careGap: string;
  status: 'Pending' | 'Scheduled' | 'Confirmed' | 'Rescheduled' | 'Completed';
  assignedPCP: string;
  appointmentDate: string;
  confirmationStatus: 'Pending' | 'Pending Provider Confirmation' | 'Confirmed' | 'Reschedule Requested' | 'Completed';
}

interface Notification {
  id: string;
  type: 'confirmation' | 'reschedule' | 'new';
  message: string;
  timestamp: string;
  patientName?: string;
  patientId?: string;
}

interface Provider {
  id: string;
  name: string;
  specialty: string;
  location: string;
  phone: string;
  email: string;
  patientCount: number;
  status: 'Active' | 'On Leave';
  schedule?: {
    days: string[];
    hours: string;
  };
}

interface TimeSlot {
  date: string;
  time: string;
}

const CareCoordinatorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [callDisposition, setCallDisposition] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { date: '', time: '' },
    { date: '', time: '' },
    { date: '', time: '' }
  ]);

  // Mock data - Open cases (for Home tab)
  const [openCases, setOpenCases] = useState<Patient[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      careGap: 'Annual Physical',
      status: 'Pending',
      assignedPCP: 'Dr. Michael Chen',
      appointmentDate: '2024-02-15',
      confirmationStatus: 'Pending'
    },
    {
      id: '2',
      name: 'Robert Martinez',
      careGap: 'Diabetes Check',
      status: 'Confirmed',
      assignedPCP: 'Dr. Emily Rodriguez',
      appointmentDate: '2024-02-10',
      confirmationStatus: 'Confirmed'
    },
    {
      id: '3',
      name: 'Jennifer Lee',
      careGap: 'Mammogram',
      status: 'Rescheduled',
      assignedPCP: 'Dr. Michael Chen',
      appointmentDate: '2024-02-20',
      confirmationStatus: 'Reschedule Requested'
    },
    {
      id: '4',
      name: 'David Thompson',
      careGap: 'Cardiac Screening',
      status: 'Pending',
      assignedPCP: 'Dr. Emily Rodriguez',
      appointmentDate: '2024-02-12',
      confirmationStatus: 'Pending'
    }
  ]);

  // Mock data - All patients assigned to this coordinator
  const [allPatients, setAllPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      careGap: 'Annual Physical',
      status: 'Pending',
      assignedPCP: 'Dr. Michael Chen',
      appointmentDate: '2024-02-15',
      confirmationStatus: 'Pending'
    },
    {
      id: '2',
      name: 'Robert Martinez',
      careGap: 'Diabetes Check',
      status: 'Confirmed',
      assignedPCP: 'Dr. Emily Rodriguez',
      appointmentDate: '2024-02-10',
      confirmationStatus: 'Confirmed'
    },
    {
      id: '3',
      name: 'Jennifer Lee',
      careGap: 'Mammogram',
      status: 'Rescheduled',
      assignedPCP: 'Dr. Michael Chen',
      appointmentDate: '2024-02-20',
      confirmationStatus: 'Reschedule Requested'
    },
    {
      id: '4',
      name: 'David Thompson',
      careGap: 'Cardiac Screening',
      status: 'Pending',
      assignedPCP: 'Dr. Emily Rodriguez',
      appointmentDate: '2024-02-12',
      confirmationStatus: 'Pending'
    },
    {
      id: '5',
      name: 'Maria Garcia',
      careGap: 'Annual Physical',
      status: 'Completed',
      assignedPCP: 'Dr. Michael Chen',
      appointmentDate: '2024-01-20',
      confirmationStatus: 'Completed'
    },
    {
      id: '6',
      name: 'John Smith',
      careGap: 'Colonoscopy',
      status: 'Completed',
      assignedPCP: 'Dr. James Wilson',
      appointmentDate: '2024-01-15',
      confirmationStatus: 'Completed'
    },
    {
      id: '7',
      name: 'Patricia Brown',
      careGap: 'Diabetes Check',
      status: 'Completed',
      assignedPCP: 'Dr. Emily Rodriguez',
      appointmentDate: '2024-01-10',
      confirmationStatus: 'Completed'
    },
    {
      id: '8',
      name: 'Thomas Wilson',
      careGap: 'Cardiac Screening',
      status: 'Completed',
      assignedPCP: 'Dr. James Wilson',
      appointmentDate: '2024-01-05',
      confirmationStatus: 'Completed'
    },
    {
      id: '9',
      name: 'Linda Davis',
      careGap: 'Mammogram',
      status: 'Completed',
      assignedPCP: 'Dr. Sarah Patel',
      appointmentDate: '2023-12-28',
      confirmationStatus: 'Completed'
    },
    {
      id: '10',
      name: 'Christopher Moore',
      careGap: 'Annual Physical',
      status: 'Completed',
      assignedPCP: 'Dr. Michael Chen',
      appointmentDate: '2023-12-20',
      confirmationStatus: 'Completed'
    }
  ]);

  const notifications: Notification[] = [
    {
      id: '1',
      type: 'confirmation',
      message: 'Patient confirmed appointment',
      timestamp: '2 hours ago',
      patientName: 'Robert Martinez',
      patientId: '2'
    },
    {
      id: '2',
      type: 'reschedule',
      message: 'PCP requested reschedule',
      timestamp: '5 hours ago',
      patientName: 'Jennifer Lee',
      patientId: '3'
    },
    {
      id: '3',
      type: 'new',
      message: 'New patient assigned',
      timestamp: '1 day ago',
      patientName: 'David Thompson',
      patientId: '4'
    }
  ];

  const providers: Provider[] = [
    {
      id: '1',
      name: 'Dr. Michael Chen',
      specialty: 'Internal Medicine',
      location: 'Main Street Medical Center',
      phone: '(555) 123-4567',
      email: 'mchen@mainstreetmed.com',
      patientCount: 24,
      status: 'Active',
      schedule: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        hours: '9:00 AM - 5:00 PM'
      }
    },
    {
      id: '2',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Family Medicine',
      location: 'Community Health Clinic',
      phone: '(555) 234-5678',
      email: 'erodriguez@communityhealth.com',
      patientCount: 18,
      status: 'Active',
      schedule: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        hours: '8:00 AM - 4:00 PM'
      }
    },
    {
      id: '3',
      name: 'Dr. James Wilson',
      specialty: 'Cardiology',
      location: 'Heart & Vascular Institute',
      phone: '(555) 345-6789',
      email: 'jwilson@heartinstitute.com',
      patientCount: 12,
      status: 'Active'
    },
    {
      id: '4',
      name: 'Dr. Sarah Patel',
      specialty: 'Endocrinology',
      location: 'Diabetes Care Center',
      phone: '(555) 456-7890',
      email: 'spatel@diabetescare.com',
      patientCount: 15,
      status: 'Active'
    },
    {
      id: '5',
      name: 'Dr. Robert Kim',
      specialty: 'Oncology',
      location: 'Cancer Treatment Center',
      phone: '(555) 567-8901',
      email: 'rkim@cancertreatment.com',
      patientCount: 8,
      status: 'On Leave'
    },
    {
      id: '6',
      name: 'Dr. Lisa Anderson',
      specialty: 'Pediatrics',
      location: 'Children\'s Medical Group',
      phone: '(555) 678-9012',
      email: 'landerson@childrensmed.com',
      patientCount: 22,
      status: 'Active'
    }
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'Completed':
        return 'badge-success';
      case 'Scheduled':
      case 'Pending Provider Confirmation':
        return 'badge-info';
      case 'Pending':
        return 'badge-warning';
      case 'Rescheduled':
      case 'Reschedule Requested':
        return 'badge-info';
      default:
        return 'badge-info';
    }
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowCallModal(true);
    setCallDisposition('');
    setTimeSlots([{ date: '', time: '' }, { date: '', time: '' }, { date: '', time: '' }]);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === 'new' && notification.patientId) {
      const patient = allPatients.find(p => p.id === notification.patientId);
      if (patient) {
        handlePatientClick(patient);
      }
    }
  };

  const getProviderByName = (name: string): Provider | undefined => {
    return providers.find(p => p.name === name);
  };

  const handleCallAttemptSubmit = () => {
    if (!selectedPatient || !callDisposition) return;

    // Update patient status based on disposition
    let newStatus: Patient['status'] = selectedPatient.status;
    let newConfirmationStatus: Patient['confirmationStatus'] = selectedPatient.confirmationStatus;
    let newAppointmentDate = selectedPatient.appointmentDate;

    switch (callDisposition) {
      case 'scheduled':
        newStatus = 'Scheduled';
        newConfirmationStatus = 'Pending Provider Confirmation';
        // Update appointment date with first time slot if available
        if (timeSlots[0].date) {
          newAppointmentDate = timeSlots[0].date;
        }
        break;
      case 'voicemail':
      case 'hang up':
        newStatus = 'Pending';
        newConfirmationStatus = 'Pending';
        break;
      case 'insurance expired':
      case 'patient deceased':
      case 'changed pcp':
        newStatus = 'Pending';
        newConfirmationStatus = 'Pending';
        // Could mark as needing follow-up or different status
        break;
    }

    const updatedPatient: Patient = {
      ...selectedPatient,
      status: newStatus,
      confirmationStatus: newConfirmationStatus,
      appointmentDate: newAppointmentDate
    };

    // Update open cases
    setOpenCases(prev => {
      const index = prev.findIndex(p => p.id === selectedPatient.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = updatedPatient;
        return updated;
      }
      return prev;
    });

    // Update all patients
    setAllPatients(prev => {
      const index = prev.findIndex(p => p.id === selectedPatient.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = updatedPatient;
        return updated;
      }
      return prev;
    });

    // Close modal
    setShowCallModal(false);
    setSelectedPatient(null);
    setCallDisposition('');
    setTimeSlots([{ date: '', time: '' }, { date: '', time: '' }, { date: '', time: '' }]);
  };

  const updateTimeSlot = (index: number, field: 'date' | 'time', value: string) => {
    setTimeSlots(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  return (
    <div className="coordinator-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-container">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill="#4A90E2"/>
              <path d="M24 12L32 20H28V28H20V20H16L24 12Z" fill="white"/>
              <path d="M16 32H32V36H16V32Z" fill="white"/>
            </svg>
            <span className="logo-text">CareLink</span>
          </div>
          <nav className="main-nav">
            <button 
              className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              Home
            </button>
            <button 
              className={`nav-item ${activeTab === 'patients' ? 'active' : ''}`}
              onClick={() => setActiveTab('patients')}
            >
              Patients
            </button>
            <button 
              className={`nav-item ${activeTab === 'providers' ? 'active' : ''}`}
              onClick={() => setActiveTab('providers')}
            >
              Providers
            </button>
            <button 
              className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              Reports
            </button>
          </nav>
          <button 
            className="btn btn-ghost logout-btn"
            onClick={() => navigate('/')}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="content-primary">
            {activeTab === 'home' && (
              <>
                <div className="page-header">
                  <h1>Open Cases</h1>
                  <p className="page-subtitle">Manage patient appointments and care coordination</p>
                </div>

                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Care Gap</th>
                        <th>Status</th>
                        <th>Assigned PCP</th>
                        <th>Appointment Date</th>
                        <th>Confirmation Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {openCases.map((patient) => (
                        <tr 
                          key={patient.id}
                          className="patient-row"
                          onClick={() => handlePatientClick(patient)}
                        >
                          <td>
                            <strong>{patient.name}</strong>
                          </td>
                          <td>{patient.careGap}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(patient.status)}`}>
                              {patient.status}
                            </span>
                          </td>
                          <td>{patient.assignedPCP}</td>
                          <td>{new Date(patient.appointmentDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(patient.confirmationStatus)}`}>
                              {patient.confirmationStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'patients' && (
              <>
                <div className="page-header">
                  <h1>All Patients</h1>
                  <p className="page-subtitle">All patients assigned to you</p>
                </div>

                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Care Gap</th>
                        <th>Status</th>
                        <th>Assigned PCP</th>
                        <th>Appointment Date</th>
                        <th>Confirmation Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allPatients.map((patient) => (
                        <tr 
                          key={patient.id}
                          className={patient.status !== 'Completed' ? 'patient-row' : ''}
                          onClick={() => patient.status !== 'Completed' && handlePatientClick(patient)}
                        >
                          <td>
                            <strong>{patient.name}</strong>
                          </td>
                          <td>{patient.careGap}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(patient.status)}`}>
                              {patient.status}
                            </span>
                          </td>
                          <td>{patient.assignedPCP}</td>
                          <td>{new Date(patient.appointmentDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(patient.confirmationStatus)}`}>
                              {patient.confirmationStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'providers' && (
              <>
                <div className="page-header">
                  <h1>Providers</h1>
                  <p className="page-subtitle">All doctors associated with the IPA</p>
                </div>

                <div className="providers-grid">
                  {providers.map((provider) => (
                    <div key={provider.id} className="provider-card">
                      <div className="provider-header">
                        <div className="provider-name-section">
                          <h3 className="provider-name">{provider.name}</h3>
                          <span className={`badge ${provider.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                            {provider.status}
                          </span>
                        </div>
                        <div className="provider-specialty">{provider.specialty}</div>
                      </div>
                      <div className="provider-details">
                        <div className="provider-detail-item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span>{provider.location}</span>
                        </div>
                        <div className="provider-detail-item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                          <span>{provider.phone}</span>
                        </div>
                        <div className="provider-detail-item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                          <span>{provider.email}</span>
                        </div>
                        <div className="provider-detail-item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          <span>{provider.patientCount} assigned patients</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'reports' && (
              <>
                <div className="page-header">
                  <h1>Reports</h1>
                  <p className="page-subtitle">View analytics and reports</p>
                </div>
                <div className="card">
                  <p>Reports functionality coming soon...</p>
                </div>
              </>
            )}
          </div>

          <aside className="notifications-panel">
            <div className="panel-header">
              <h2>Notifications</h2>
              <span className="notification-count">{notifications.length}</span>
            </div>
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.type === 'new' ? 'clickable' : ''}`}
                  onClick={() => notification.type === 'new' && handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {notification.type === 'confirmation' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    )}
                    {notification.type === 'reschedule' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    )}
                    {notification.type === 'new' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                    )}
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    {notification.patientName && (
                      <p className="notification-patient">{notification.patientName}</p>
                    )}
                    <p className="notification-time">{notification.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      {showCallModal && selectedPatient && (
        <CallAttemptModal
          patient={selectedPatient}
          provider={getProviderByName(selectedPatient.assignedPCP)}
          callDisposition={callDisposition}
          setCallDisposition={setCallDisposition}
          timeSlots={timeSlots}
          updateTimeSlot={updateTimeSlot}
          onClose={() => {
            setShowCallModal(false);
            setSelectedPatient(null);
            setCallDisposition('');
            setTimeSlots([{ date: '', time: '' }, { date: '', time: '' }, { date: '', time: '' }]);
          }}
          onSubmit={handleCallAttemptSubmit}
        />
      )}
    </div>
  );
};

interface CallAttemptModalProps {
  patient: Patient;
  provider: Provider | undefined;
  callDisposition: string;
  setCallDisposition: (value: string) => void;
  timeSlots: TimeSlot[];
  updateTimeSlot: (index: number, field: 'date' | 'time', value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const CallAttemptModal = ({
  patient,
  provider,
  callDisposition,
  setCallDisposition,
  timeSlots,
  updateTimeSlot,
  onClose,
  onSubmit
}: CallAttemptModalProps) => {
  const isScheduled = callDisposition === 'scheduled';
  const isFirstSlotRequired = timeSlots[0].date && timeSlots[0].time;
  const canSubmit = callDisposition && (!isScheduled || isFirstSlotRequired);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Log Call Attempt</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="patient-info-section">
            <h3>{patient.name}</h3>
            <p className="patient-detail">Care Gap: {patient.careGap}</p>
            <p className="patient-detail">Assigned PCP: {patient.assignedPCP}</p>
          </div>

          <div className="form-section">
            <label htmlFor="disposition" className="form-label">
              Call Disposition <span className="required">*</span>
            </label>
            <select
              id="disposition"
              className="form-select"
              value={callDisposition}
              onChange={(e) => setCallDisposition(e.target.value)}
            >
              <option value="">Select disposition...</option>
              <option value="voicemail">Voicemail</option>
              <option value="hang up">Hang Up</option>
              <option value="insurance expired">Insurance Expired</option>
              <option value="patient deceased">Patient Deceased</option>
              <option value="changed pcp">Changed PCP</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          {isScheduled && provider && (
            <div className="provider-schedule-section">
              <h4>Provider Information</h4>
              <div className="provider-info-card">
                <p><strong>{provider.name}</strong></p>
                <p>{provider.specialty}</p>
                <p>{provider.location}</p>
                {provider.schedule && (
                  <div className="schedule-info">
                    <p><strong>Available Days:</strong> {provider.schedule.days.join(', ')}</p>
                    <p><strong>Hours:</strong> {provider.schedule.hours}</p>
                  </div>
                )}
              </div>

              <div className="time-slots-section">
                <h4>Preferred Time Slots</h4>
                <div className="time-slots-list">
                  {timeSlots.map((slot, index) => (
                    <div key={index} className="time-slot-input">
                      <label className="time-slot-label">
                        {index === 0 ? 'Time Slot 1 (Required)' : `Time Slot ${index + 1} (Optional)`}
                      </label>
                      <div className="time-slot-fields">
                        <input
                          type="date"
                          className="form-input"
                          value={slot.date}
                          onChange={(e) => updateTimeSlot(index, 'date', e.target.value)}
                          required={index === 0}
                        />
                        <input
                          type="time"
                          className="form-input"
                          value={slot.time}
                          onChange={(e) => updateTimeSlot(index, 'time', e.target.value)}
                          required={index === 0}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={onSubmit}
            disabled={!canSubmit}
          >
            Log Call Attempt
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareCoordinatorDashboard;

