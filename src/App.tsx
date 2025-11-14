import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CareCoordinatorDashboard from './pages/CareCoordinatorDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import PatientView from './pages/PatientView';
import './App.css';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/coordinator" element={<CareCoordinatorDashboard />} />
          <Route path="/provider" element={<ProviderDashboard />} />
          <Route path="/patient" element={<PatientView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
