import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

// Layout & Protection
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Dashboard Pages
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

            {/* Protected Dashboard Routes */}
            <Route 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/trip-planner" element={<TripPlannerPage />} />
              <Route path="/itinerary" element={<ItineraryResultPage />} />
              <Route path="/planner/result" element={<ItineraryResultPage />} />
              <Route path="/assistant" element={<OfflineAssistantPage />} />
              <Route path="/offline" element={<OfflineAssistantPage />} />
              <Route path="/landmark-explorer" element={<LandmarkExplorerPage />} />
              <Route path="/landmarks" element={<LandmarkExplorerPage />} />
              <Route path="/sos" element={<SOSPage />} />
            </Route>

            {/* Fallback redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </TripProvider>
    </AuthProvider>
  );
}

export default App;

