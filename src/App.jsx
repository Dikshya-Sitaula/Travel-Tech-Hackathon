import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

// Dashboard Pages
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import TripPlannerPage from './pages/dashboard/TripPlannerPage';
import ItineraryResultPage from './pages/dashboard/ItineraryResultPage';
import OfflineAssistantPage from './pages/dashboard/OfflineAssistantPage';
import LandmarkExplorerPage from './pages/dashboard/LandmarkExplorerPage';
import SOSPage from './pages/dashboard/SOSPage';

// Context
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';

function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="planner" element={<TripPlannerPage />} />
              <Route path="planner/result" element={<ItineraryResultPage />} />
              <Route path="offline" element={<OfflineAssistantPage />} />
              <Route path="landmarks" element={<LandmarkExplorerPage />} />
              <Route path="sos" element={<SOSPage />} />
            </Route>
          </Routes>
        </Router>
      </TripProvider>
    </AuthProvider>
  );
}

export default App;
