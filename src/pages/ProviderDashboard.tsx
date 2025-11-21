import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ProviderDashboard.css';

interface TimeSlot {
  date: string;
  time: string;
}

interface AppointmentRequest {
  id: string;
  patientId: string;
  patientName: string;
  careGap: string;
  coordinatorName?: string;
  proposedSlots: TimeSlot[]; // Up to 3 slots from coordinator
  pcpProposedSlots?: TimeSlot[]; // 2 slots from PCP if rescheduled
  status: 'pending' | 'accepted' | 'declined' | 'reschedule_proposed_by_pcp';
  selectedSlotId?: string; // ID of selected slot when accepting
  declineReason?: string;
  location?: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  patientName: string;
  status: 'open' | 'confirmed' | 'pending';
  careGap?: string;
  requestId?: string; // Link to the source appointment request
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

  // State for calendar navigation
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Calculate week dates based on currentDate
  const calculateWeekDatesFromDate = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Get Monday
    const monday = new Date(date);
    monday.setDate(diff);
    const week = [];
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(monday);
      weekDate.setDate(monday.getDate() + i);
      week.push(weekDate.toISOString().split('T')[0]);
    }
    return week;
  };

  const weekDates = useMemo(() => calculateWeekDatesFromDate(currentDate), [currentDate]);

  // Selected date for daily view (defaults to first day of current week)
  const [selectedDate, setSelectedDate] = useState(() => {
    const dates = calculateWeekDatesFromDate(new Date());
    return dates[0];
  });
  
  const [viewType, setViewType] = useState<'daily' | 'weekly'>('daily');
  
  // Update selectedDate when currentDate changes in daily view
  useEffect(() => {
    if (viewType === 'daily') {
      setSelectedDate(currentDate.toISOString().split('T')[0]);
    }
  }, [currentDate, viewType]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  
  // Appointment request states
  const [appointmentRequests, setAppointmentRequests] = useState<AppointmentRequest[]>([
    {
      id: 'req1',
      patientId: '1',
      patientName: 'Sarah Johnson',
      careGap: 'Annual Physical',
      coordinatorName: 'Care Coordinator',
      proposedSlots: [
        { date: '2024-02-20', time: '09:00' },
        { date: '2024-02-21', time: '10:30' },
        { date: '2024-02-22', time: '14:00' }
      ],
      status: 'pending',
      location: 'Main Street Medical Center'
    },
    {
      id: 'req2',
      patientId: '2',
      patientName: 'David Thompson',
      careGap: 'Cardiac Screening',
      coordinatorName: 'Care Coordinator',
      proposedSlots: [
        { date: '2024-02-19', time: '11:00' },
        { date: '2024-02-20', time: '15:00' }
      ],
      status: 'pending',
      location: 'Main Street Medical Center'
    },
    {
      id: 'req3',
      patientId: '3',
      patientName: 'Jennifer Lee',
      careGap: 'Mammogram',
      coordinatorName: 'Care Coordinator',
      proposedSlots: [
        { date: '2024-02-23', time: '09:30' },
        { date: '2024-02-23', time: '14:30' },
        { date: '2024-02-24', time: '10:00' }
      ],
      status: 'pending',
      location: 'Main Street Medical Center'
    }
  ]);
  
  const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [declineReasonOther, setDeclineReasonOther] = useState('');
  const [rescheduleSlots, setRescheduleSlots] = useState<TimeSlot[]>([
    { date: '', time: '' },
    { date: '', time: '' }
  ]);

  // Mock data - appointments for a week (now stateful so we can update them)
  const [allAppointments, setAllAppointments] = useState<Appointment[]>(() => {
    const dates = calculateWeekDates();
    if (!dates || dates.length === 0) return [];
    return [
      // Monday
      { id: '1', date: dates[0], time: '09:00', patientName: '', status: 'open' },
      { id: '2', date: dates[0], time: '09:30', patientName: 'Robert Martinez', status: 'confirmed', careGap: 'Diabetes Check' },
      { id: '3', date: dates[0], time: '10:00', patientName: '', status: 'open' },
      { id: '4', date: dates[0], time: '11:00', patientName: 'Sarah Johnson', status: 'pending', careGap: 'Annual Physical', requestId: 'req1' },
      { id: '5', date: dates[0], time: '14:00', patientName: 'David Thompson', status: 'pending', careGap: 'Cardiac Screening', requestId: 'req2' },
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

  // Standard time slots for the schedule (9:00 AM to 5:00 PM, 30-minute intervals)
  const standardTimeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }, []);

  // Get appointments for selected date (daily view)
  const dailyAppointments = allAppointments.filter(apt => apt.date === selectedDate);
  
  // Create full schedule for daily view with all time slots
  const dailySchedule = useMemo(() => {
    return standardTimeSlots.map(time => {
      const appointment = dailyAppointments.find(apt => apt.time === time);
      if (appointment) {
        return appointment;
      }
      // Return an "open" slot if no appointment exists
      return {
        id: `open-${selectedDate}-${time}`,
        date: selectedDate,
        time: time,
        patientName: '',
        status: 'open' as const
      };
    });
  }, [selectedDate, dailyAppointments, standardTimeSlots]);

  // Get appointments for the week (weekly view)
  const weeklyAppointments = allAppointments;

  // Calendar navigation functions
  const navigateDate = (direction: 'prev' | 'next' | 'today') => {
    const newDate = new Date(currentDate);
    
    if (direction === 'today') {
      setCurrentDate(new Date());
      const todayDates = calculateWeekDatesFromDate(new Date());
      setSelectedDate(todayDates[0]);
    } else if (viewType === 'daily') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
      setCurrentDate(newDate);
      setSelectedDate(newDate.toISOString().split('T')[0]);
    } else {
      // Weekly view
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      setCurrentDate(newDate);
    }
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    if (appointment.status === 'pending') {
      // Try to find the associated request
      if (appointment.requestId) {
        const associatedRequest = appointmentRequests.find(req => req.id === appointment.requestId);
        if (associatedRequest) {
          // Find which slot matches this appointment
          const slotIndex = associatedRequest.proposedSlots.findIndex(
            slot => slot.date === appointment.date && slot.time === appointment.time
          );
          if (slotIndex !== -1) {
            setSelectedSlotId(`slot-${slotIndex}`);
          } else {
            // If exact match not found, try to match by time only (in case dates differ)
            const timeMatchIndex = associatedRequest.proposedSlots.findIndex(
              slot => slot.time === appointment.time
            );
            if (timeMatchIndex !== -1) {
              setSelectedSlotId(`slot-${timeMatchIndex}`);
            }
          }
          handleRequestClick(associatedRequest);
          return;
        }
      }
      // Fallback: try to find request by patient name and date/time
      const matchingRequest = appointmentRequests.find(req => {
        if (req.patientName !== appointment.patientName) return false;
        // Check if any proposed slot matches this appointment
        return req.proposedSlots.some(slot => 
          slot.date === appointment.date && slot.time === appointment.time
        ) || req.proposedSlots.some(slot => slot.time === appointment.time);
      });
      if (matchingRequest) {
        // Find the slot index - prefer exact match, fallback to time match
        let slotIndex = matchingRequest.proposedSlots.findIndex(
          slot => slot.date === appointment.date && slot.time === appointment.time
        );
        if (slotIndex === -1) {
          slotIndex = matchingRequest.proposedSlots.findIndex(
            slot => slot.time === appointment.time
          );
        }
        if (slotIndex !== -1) {
          setSelectedSlotId(`slot-${slotIndex}`);
        }
        handleRequestClick(matchingRequest);
        return;
      }
      // If no request found, use the old modal
      setSelectedAppointment(appointment);
      setShowAppointmentModal(true);
    }
  };

  const handleRequestClick = (request: AppointmentRequest) => {
    setSelectedRequest(request);
    setSelectedSlotId('');
    // If rescheduled, pre-fill the reschedule slots for viewing/editing
    if (request.status === 'reschedule_proposed_by_pcp' && request.pcpProposedSlots) {
      setRescheduleSlots([...request.pcpProposedSlots]);
    } else {
      setRescheduleSlots([{ date: '', time: '' }, { date: '', time: '' }]);
    }
    setShowAppointmentModal(true);
  };

  const handleAcceptRequest = () => {
    if (!selectedRequest || !selectedSlotId) return;

    // Find the selected slot
    const selectedSlot = selectedRequest.proposedSlots.find(
      (_, index) => `slot-${index}` === selectedSlotId
    );

    if (!selectedSlot) return;

    // Update request status
    setAppointmentRequests(prev =>
      prev.map(req =>
        req.id === selectedRequest.id
          ? { ...req, status: 'accepted' as const, selectedSlotId }
          : req
      )
    );

    // Create confirmed appointment in the schedule
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      date: selectedSlot.date,
      time: selectedSlot.time,
      patientName: selectedRequest.patientName,
      status: 'confirmed',
      careGap: selectedRequest.careGap,
      requestId: selectedRequest.id
    };

    setAllAppointments(prev => [...prev, newAppointment]);

    // Close modal
    setShowAppointmentModal(false);
    setSelectedRequest(null);
    setSelectedSlotId('');
  };

  const handleDeclineRequest = () => {
    if (!selectedRequest) return;
    
    const finalReason = declineReason === 'other' 
      ? declineReasonOther.trim() 
      : declineReason.trim();
    
    if (!finalReason) return;

    // Update request status
    setAppointmentRequests(prev =>
      prev.map(req =>
        req.id === selectedRequest.id
          ? { ...req, status: 'declined' as const, declineReason: finalReason }
          : req
      )
    );

    // Close modals
    setShowDeclineModal(false);
    setShowAppointmentModal(false);
    setSelectedRequest(null);
    setDeclineReason('');
    setDeclineReasonOther('');
  };

  const handleRescheduleRequest = () => {
    if (!selectedRequest) return;

    // Validate both slots are filled
    if (!rescheduleSlots[0].date || !rescheduleSlots[0].time ||
        !rescheduleSlots[1].date || !rescheduleSlots[1].time) {
      return;
    }

    // Update request with PCP proposed slots
    setAppointmentRequests(prev =>
      prev.map(req =>
        req.id === selectedRequest.id
          ? {
              ...req,
              status: 'reschedule_proposed_by_pcp' as const,
              pcpProposedSlots: rescheduleSlots
            }
          : req
      )
    );

    // Close modals
    setShowRescheduleModal(false);
    setShowAppointmentModal(false);
    setSelectedRequest(null);
    setRescheduleSlots([{ date: '', time: '' }, { date: '', time: '' }]);
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

  const updateRescheduleSlot = (index: number, field: 'date' | 'time', value: string) => {
    setRescheduleSlots(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
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
                <div className="header-left">
                  <div className="calendar-navigation">
                    <button
                      className="nav-arrow-btn"
                      onClick={() => navigateDate('prev')}
                      aria-label="Previous"
                      title="Previous"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="date-display">
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
                    <button
                      className="nav-arrow-btn"
                      onClick={() => navigateDate('next')}
                      aria-label="Next"
                      title="Next"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <button
                      className="today-btn"
                      onClick={() => navigateDate('today')}
                    >
                      Today
                    </button>
                  </div>
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
                  {dailySchedule.map((appointment) => (
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
                  {standardTimeSlots.map((time) => (
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
              <h2>Appointment Requests</h2>
              <span className="patient-count">
                {appointmentRequests.filter(r => r.status === 'pending' || r.status === 'reschedule_proposed_by_pcp').length}
              </span>
            </div>
            <div className="patients-list">
              {appointmentRequests
                .filter(req => req.status === 'pending' || req.status === 'reschedule_proposed_by_pcp')
                .map((request) => (
                  <button
                    key={request.id}
                    className="patient-card clickable"
                    onClick={() => handleRequestClick(request)}
                  >
                    <div className="patient-info">
                      <div className="patient-name">{request.patientName}</div>
                      <div className="patient-care-gap">{request.careGap}</div>
                      <div className="patient-date">
                        {request.status === 'reschedule_proposed_by_pcp' 
                          ? `Rescheduled - ${request.pcpProposedSlots?.length || 0} new options`
                          : `${request.proposedSlots.length} time option${request.proposedSlots.length !== 1 ? 's' : ''}`
                        }
                      </div>
                    </div>
                    <div className="patient-status">
                      <span className={`badge ${request.status === 'reschedule_proposed_by_pcp' ? 'badge-info' : 'badge-warning'}`}>
                        {request.status === 'reschedule_proposed_by_pcp' ? 'Rescheduled' : 'Pending'}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>
                  </button>
                ))}
              {appointmentRequests.filter(req => req.status === 'pending' || req.status === 'reschedule_proposed_by_pcp').length === 0 && (
                <div className="empty-state">
                  <p>No pending appointment requests</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {showAppointmentModal && selectedRequest && (
        <AppointmentRequestModal
          request={selectedRequest}
          selectedSlotId={selectedSlotId}
          onSlotSelect={setSelectedSlotId}
          onClose={() => {
            setShowAppointmentModal(false);
            setSelectedRequest(null);
            setSelectedSlotId('');
          }}
          onAccept={handleAcceptRequest}
          onDecline={() => {
            setShowDeclineModal(true);
          }}
          onReschedule={() => {
            setShowRescheduleModal(true);
          }}
        />
      )}

      {showAppointmentModal && selectedAppointment && !selectedRequest && (
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

      {showDeclineModal && selectedRequest && (
        <DeclineModal
          request={selectedRequest}
          declineReason={declineReason}
          setDeclineReason={setDeclineReason}
          declineReasonOther={declineReasonOther}
          setDeclineReasonOther={setDeclineReasonOther}
          onClose={() => {
            setShowDeclineModal(false);
            setDeclineReason('');
            setDeclineReasonOther('');
          }}
          onConfirm={handleDeclineRequest}
        />
      )}

      {showRescheduleModal && selectedRequest && (
        <RescheduleModal
          request={selectedRequest}
          rescheduleSlots={rescheduleSlots}
          updateRescheduleSlot={updateRescheduleSlot}
          onClose={() => {
            setShowRescheduleModal(false);
            setRescheduleSlots([{ date: '', time: '' }, { date: '', time: '' }]);
          }}
          onConfirm={handleRescheduleRequest}
        />
      )}
    </div>
  );
};

interface AppointmentRequestModalProps {
  request: AppointmentRequest;
  selectedSlotId: string;
  onSlotSelect: (slotId: string) => void;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onReschedule: () => void;
}

const AppointmentRequestModal = ({
  request,
  selectedSlotId,
  onSlotSelect,
  onClose,
  onAccept,
  onDecline,
  onReschedule
}: AppointmentRequestModalProps) => {
  const canAccept = selectedSlotId !== '';
  const isRescheduled = request.status === 'reschedule_proposed_by_pcp';

  const formatSlotDisplay = (slot: TimeSlot) => {
    const date = new Date(slot.date);
    return {
      dateStr: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      timeStr: slot.time
    };
  };

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
            <h3>{request.patientName}</h3>
            <div className="appointment-details">
              {request.careGap && (
                <div className="detail-item">
                  <strong>Care Gap:</strong> {request.careGap}
                </div>
              )}
              {request.location && (
                <div className="detail-item">
                  <strong>Location:</strong> {request.location}
                </div>
              )}
              {request.coordinatorName && (
                <div className="detail-item">
                  <strong>Coordinator:</strong> {request.coordinatorName}
                </div>
              )}
            </div>
          </div>

          {isRescheduled && request.pcpProposedSlots && (
            <div className="reschedule-info-section">
              <h4>PCP Proposed New Times</h4>
              <div className="time-slots-list">
                {request.pcpProposedSlots.map((slot, index) => {
                  const { dateStr, timeStr } = formatSlotDisplay(slot);
                  return (
                    <div key={index} className="time-slot-option proposed-slot">
                      <div className="slot-content">
                        <div className="slot-date">{dateStr}</div>
                        <div className="slot-time">{timeStr}</div>
                        {request.location && (
                          <div className="slot-location">{request.location}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="info-message">Waiting for coordinator/patient response on these proposed times.</p>
            </div>
          )}

          {!isRescheduled && (
            <div className="time-slots-section">
              <h4>Select a Time Option</h4>
              <div className="time-slots-list">
                {request.proposedSlots.map((slot, index) => {
                  const slotId = `slot-${index}`;
                  const { dateStr, timeStr } = formatSlotDisplay(slot);
                  const isSelected = selectedSlotId === slotId;
                  
                  return (
                    <label
                      key={slotId}
                      className={`time-slot-option ${isSelected ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="timeSlot"
                        value={slotId}
                        checked={isSelected}
                        onChange={() => onSlotSelect(slotId)}
                      />
                      <div className="slot-content">
                        <div className="slot-date">{dateStr}</div>
                        <div className="slot-time">{timeStr}</div>
                        {request.location && (
                          <div className="slot-location">{request.location}</div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
              {!canAccept && (
                <p className="validation-message">Please select a time option to accept</p>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            {isRescheduled ? 'Close' : 'Cancel'}
          </button>
          {!isRescheduled && (
            <>
              <button className="btn btn-outline" onClick={onReschedule}>
                Reschedule
              </button>
              <button className="btn btn-outline" onClick={onDecline}>
                Decline
              </button>
              <button 
                className="btn btn-primary" 
                onClick={onAccept}
                disabled={!canAccept}
              >
                Accept
              </button>
            </>
          )}
          {isRescheduled && (
            <button className="btn btn-outline" onClick={onReschedule}>
              Update Reschedule
            </button>
          )}
        </div>
      </div>
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

interface DeclineModalProps {
  request: AppointmentRequest;
  declineReason: string;
  setDeclineReason: (reason: string) => void;
  declineReasonOther: string;
  setDeclineReasonOther: (reason: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const DeclineModal = ({
  request,
  declineReason,
  setDeclineReason,
  declineReasonOther,
  setDeclineReasonOther,
  onClose,
  onConfirm
}: DeclineModalProps) => {
  const canConfirm = declineReason !== '' && 
    (declineReason !== 'other' || declineReasonOther.trim() !== '');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Decline Appointment Request</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="appointment-info-section">
            <h3>{request.patientName}</h3>
            <div className="appointment-details">
              {request.careGap && (
                <div className="detail-item">
                  <strong>Care Gap:</strong> {request.careGap}
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <label htmlFor="declineReason" className="form-label">
              Decline Reason <span className="required">*</span>
            </label>
            <select
              id="declineReason"
              className="form-select"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            >
              <option value="">Select a reason...</option>
              <option value="not-available">Not Available</option>
              <option value="not-my-patient">Not My Patient</option>
              <option value="clinical-reason">Clinical Reason</option>
              <option value="schedule-conflict">Schedule Conflict</option>
              <option value="other">Other (specify below)</option>
            </select>
            {declineReason === 'other' && (
              <textarea
                className="form-textarea"
                value={declineReasonOther}
                onChange={(e) => setDeclineReasonOther(e.target.value)}
                placeholder="Please specify the reason..."
                rows={3}
              />
            )}
            {!canConfirm && (
              <p className="validation-message">Please provide a decline reason</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={onConfirm}
            disabled={!canConfirm}
          >
            Confirm Decline
          </button>
        </div>
      </div>
    </div>
  );
};

interface RescheduleModalProps {
  request: AppointmentRequest;
  rescheduleSlots: TimeSlot[];
  updateRescheduleSlot: (index: number, field: 'date' | 'time', value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const RescheduleModal = ({
  request,
  rescheduleSlots,
  updateRescheduleSlot,
  onClose,
  onConfirm
}: RescheduleModalProps) => {
  const canConfirm = 
    rescheduleSlots[0].date && rescheduleSlots[0].time &&
    rescheduleSlots[1].date && rescheduleSlots[1].time;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Reschedule Appointment</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="appointment-info-section">
            <h3>{request.patientName}</h3>
            <div className="appointment-details">
              {request.careGap && (
                <div className="detail-item">
                  <strong>Care Gap:</strong> {request.careGap}
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h4>Propose Two New Time Options</h4>
            <div className="reschedule-slots">
              {rescheduleSlots.map((slot, index) => (
                <div key={index} className="reschedule-slot">
                  <label className="slot-label">
                    Option {index + 1} <span className="required">*</span>
                  </label>
                  <div className="slot-inputs">
                    <input
                      type="date"
                      className="form-input"
                      value={slot.date}
                      onChange={(e) => updateRescheduleSlot(index, 'date', e.target.value)}
                      required
                    />
                    <input
                      type="time"
                      className="form-input"
                      value={slot.time}
                      onChange={(e) => updateRescheduleSlot(index, 'time', e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
            {!canConfirm && (
              <p className="validation-message">Please provide both time options</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={onConfirm}
            disabled={!canConfirm}
          >
            Submit Reschedule Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;

