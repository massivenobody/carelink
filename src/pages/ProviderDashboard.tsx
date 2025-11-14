import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProviderDashboard.css';

interface Appointment {
  id: string;
  date: string;
  time: string;
  patientName: string;
  status: 'open' | 'confirmed' | 'pending';
  careGap?: string;
}

interface Patient {
  id: string;
  name: string;
  status: 'pending' | 'confirmed';
  appointmentDate: string;
  careGap: string;
}

const ProviderDashboard = () => {
  const navigate = useNavigate();
  
  // Calculate week dates (Monday to Sunday) based on today
  const calculateWeekDates = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Get Monday
    const monday = new Date(today);
    monday.setDate(diff);
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push(date.toISOString().split('T')[0]);
    }
    return week;
  };

  const weekDates = useMemo(() => calculateWeekDates(), []);

  // Default to Monday of current week for daily view
  const [selectedDate, setSelectedDate] = useState(() => {
    const dates = calculateWeekDates();
    return dates[0];
  });
  const [viewType, setViewType] = useState<'daily' | 'weekly'>('daily');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  // Mock data - appointments for a week (now stateful so we can update them)
  const [allAppointments, setAllAppointments] = useState<Appointment[]>(() => {
    const dates = calculateWeekDates();
    if (!dates || dates.length === 0) return [];
    return [
      // Monday
      { id: '1', date: dates[0], time: '09:00', patientName: '', status: 'open' },
      { id: '2', date: dates[0], time: '09:30', patientName: 'Robert Martinez', status: 'confirmed', careGap: 'Diabetes Check' },
      { id: '3', date: dates[0], time: '10:00', patientName: '', status: 'open' },
      { id: '4', date: dates[0], time: '11:00', patientName: 'Sarah Johnson', status: 'pending', careGap: 'Annual Physical' },
      { id: '5', date: dates[0], time: '14:00', patientName: 'David Thompson', status: 'pending', careGap: 'Cardiac Screening' },
      { id: '6', date: dates[0], time: '15:00', patientName: '', status: 'open' },
      // Tuesday
      { id: '7', date: dates[1], time: '09:00', patientName: 'Maria Garcia', status: 'confirmed', careGap: 'Follow-up' },
      { id: '8', date: dates[1], time: '10:30', patientName: '', status: 'open' },
      { id: '9', date: dates[1], time: '11:30', patientName: 'John Smith', status: 'pending', careGap: 'Consultation' },
      { id: '10', date: dates[1], time: '14:30', patientName: '', status: 'open' },
      // Wednesday
      { id: '11', date: dates[2], time: '09:30', patientName: '', status: 'open' },
      { id: '12', date: dates[2], time: '10:00', patientName: 'Patricia Brown', status: 'confirmed', careGap: 'Check-up' },
      { id: '13', date: dates[2], time: '11:00', patientName: '', status: 'open' },
      { id: '14', date: dates[2], time: '15:00', patientName: 'Thomas Wilson', status: 'pending', careGap: 'Review' },
      // Thursday
      { id: '15', date: dates[3], time: '09:00', patientName: '', status: 'open' },
      { id: '16', date: dates[3], time: '10:00', patientName: 'Linda Davis', status: 'confirmed', careGap: 'Screening' },
      { id: '17', date: dates[3], time: '11:30', patientName: '', status: 'open' },
      { id: '18', date: dates[3], time: '14:00', patientName: 'Christopher Moore', status: 'pending', careGap: 'Follow-up' },
      // Friday
      { id: '19', date: dates[4], time: '09:00', patientName: '', status: 'open' },
      { id: '20', date: dates[4], time: '10:30', patientName: '', status: 'open' },
      { id: '21', date: dates[4], time: '11:00', patientName: 'Jennifer Lee', status: 'pending', careGap: 'Mammogram' },
      { id: '22', date: dates[4], time: '14:30', patientName: '', status: 'open' },
    ];
  });

  // Get appointments for selected date (daily view)
  const dailyAppointments = allAppointments.filter(apt => apt.date === selectedDate);

  // Get appointments for the week (weekly view)
  const weeklyAppointments = allAppointments;

  const assignedPatients: Patient[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      status: 'pending',
      appointmentDate: '2024-02-15',
      careGap: 'Annual Physical'
    },
    {
      id: '2',
      name: 'David Thompson',
      status: 'pending',
      appointmentDate: '2024-02-12',
      careGap: 'Cardiac Screening'
    },
    {
      id: '3',
      name: 'Robert Martinez',
      status: 'confirmed',
      appointmentDate: '2024-02-10',
      careGap: 'Diabetes Check'
    }
  ];

  const handlePatientClick = (patientId: string) => {
    // In a real app, this would open a modal or navigate to patient details
    console.log('Patient clicked:', patientId);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    if (appointment.status === 'pending') {
      setSelectedAppointment(appointment);
      setShowAppointmentModal(true);
    }
  };

  const handleAcceptAppointment = () => {
    if (!selectedAppointment) return;

    // Update appointment status to confirmed
    setAllAppointments(prev => 
      prev.map(apt => 
        apt.id === selectedAppointment.id 
          ? { ...apt, status: 'confirmed' as const }
          : apt
      )
    );

    // Close modal
    setShowAppointmentModal(false);
    setSelectedAppointment(null);
  };

  const handleDeclineAppointment = () => {
    if (!selectedAppointment) return;

    // Update appointment status to open (declined, slot becomes available)
    setAllAppointments(prev => 
      prev.map(apt => 
        apt.id === selectedAppointment.id 
          ? { ...apt, status: 'open' as const, patientName: '', careGap: undefined }
          : apt
      )
    );

    // Close modal
    setShowAppointmentModal(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="provider-dashboard">
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
          <div className="provider-info">
            <span className="provider-name">Dr. Michael Chen</span>
          </div>
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
          <div className="schedule-section">
            <div className="page-header">
              <div className="header-row">
                <div>
                  <h1>Schedule</h1>
                  <p className="page-subtitle">
                    {viewType === 'daily' 
                      ? new Date(selectedDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : `Week of ${new Date(weekDates[0]).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric' 
                        })} - ${new Date(weekDates[6]).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}`
                    }
                  </p>
                </div>
                <div className="view-toggle">
                  <button
                    className={`toggle-btn ${viewType === 'daily' ? 'active' : ''}`}
                    onClick={() => setViewType('daily')}
                  >
                    Daily
                  </button>
                  <button
                    className={`toggle-btn ${viewType === 'weekly' ? 'active' : ''}`}
                    onClick={() => setViewType('weekly')}
                  >
                    Weekly
                  </button>
                </div>
              </div>
            </div>

            {viewType === 'daily' ? (
              <div className="calendar-view">
                <div className="time-slots">
                  {dailyAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className={`time-slot ${appointment.status}`}
                    >
                      <div className="time-label">{appointment.time}</div>
                      <div className="appointment-card">
                        {appointment.status === 'open' ? (
                          <div className="open-slot">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="8" x2="12" y2="12"></line>
                              <line x1="16" y1="12" x2="12" y2="12"></line>
                            </svg>
                            <span>Available</span>
                          </div>
                        ) : (
                          <div 
                            className={`booked-slot ${appointment.status === 'pending' ? 'clickable' : ''}`}
                            onClick={() => appointment.status === 'pending' && handleAppointmentClick(appointment)}
                          >
                            <div className="patient-name">{appointment.patientName}</div>
                            {appointment.careGap && (
                              <div className="care-gap">{appointment.careGap}</div>
                            )}
                            <span className={`status-badge ${appointment.status}`}>
                              {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending Confirmation'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="weekly-view">
                <div className="weekly-header">
                  <div className="time-column-header">Time</div>
                  {weekDates.map((date) => (
                    <div key={date} className="day-header">
                      <div className="day-name">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="day-date">
                        {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="weekly-grid">
                  {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30'].map((time) => (
                    <div key={time} className="weekly-row">
                      <div className="time-column">{time}</div>
                      {weekDates.map((date) => {
                        const appointment = weeklyAppointments.find(
                          apt => apt.date === date && apt.time === time
                        );
                        return (
                          <div key={`${date}-${time}`} className="weekly-cell">
                            {appointment ? (
                              appointment.status === 'open' ? (
                                <div className="open-slot-small">
                                  <span>Available</span>
                                </div>
                              ) : (
                                <div 
                                  className={`booked-slot-small ${appointment.status} ${appointment.status === 'pending' ? 'clickable' : ''}`}
                                  onClick={() => appointment.status === 'pending' && handleAppointmentClick(appointment)}
                                >
                                  <div className="patient-name-small">{appointment.patientName}</div>
                                  {appointment.careGap && (
                                    <div className="care-gap-small">{appointment.careGap}</div>
                                  )}
                                  <span className={`status-badge-small ${appointment.status}`}>
                                    {appointment.status === 'confirmed' ? '✓' : '⏳'}
                                  </span>
                                </div>
                              )
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="patients-sidebar">
            <div className="sidebar-header">
              <h2>Assigned Patients</h2>
              <span className="patient-count">{assignedPatients.length}</span>
            </div>
            <div className="patients-list">
              {assignedPatients.map((patient) => (
                <button
                  key={patient.id}
                  className={`patient-card ${patient.status === 'pending' ? 'clickable' : ''}`}
                  onClick={() => patient.status === 'pending' && handlePatientClick(patient.id)}
                  disabled={patient.status !== 'pending'}
                >
                  <div className="patient-info">
                    <div className="patient-name">{patient.name}</div>
                    <div className="patient-care-gap">{patient.careGap}</div>
                    <div className="patient-date">
                      {new Date(patient.appointmentDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="patient-status">
                    <span className={`badge ${patient.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                      {patient.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </span>
                    {patient.status === 'pending' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </main>

      {showAppointmentModal && selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowAppointmentModal(false);
            setSelectedAppointment(null);
          }}
          onAccept={handleAcceptAppointment}
          onDecline={handleDeclineAppointment}
        />
      )}
    </div>
  );
};

interface AppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

const AppointmentModal = ({ appointment, onClose, onAccept, onDecline }: AppointmentModalProps) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Appointment Request</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="appointment-info-section">
            <h3>{appointment.patientName}</h3>
            <div className="appointment-details">
              <div className="detail-item">
                <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="detail-item">
                <strong>Time:</strong> {appointment.time}
              </div>
              {appointment.careGap && (
                <div className="detail-item">
                  <strong>Care Gap:</strong> {appointment.careGap}
                </div>
              )}
              <div className="detail-item">
                <strong>Status:</strong> <span className="badge badge-warning">Pending Confirmation</span>
              </div>
            </div>
          </div>

          <div className="modal-message">
            <p>Would you like to accept or decline this appointment request?</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-outline" onClick={onDecline}>
            Decline
          </button>
          <button className="btn btn-primary" onClick={onAccept}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;

