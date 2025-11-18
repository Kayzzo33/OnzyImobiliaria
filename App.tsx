
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import Chatbot from './components/chatbot/Chatbot';
import { initGemini } from './services/geminiService';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuthStore } from './stores/useAuthStore';
import { supabase } from './services/supabase';
import AdminLayout from './components/admin/AdminLayout';
import PropertiesListPage from './pages/admin/PropertiesListPage';
import SchedulesPage from './pages/admin/SchedulesPage';
import CitiesPage from './pages/admin/CitiesPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import UsersPage from './pages/admin/UsersPage';
import SettingsPage from './pages/admin/SettingsPage';

function App() {

  useEffect(() => {
    // Initialize Gemini Service once on app load
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      initGemini(apiKey);
    } else {
      console.warn("Gemini API key not found. AI features will be disabled.");
    }
    
    // Set up the auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.getState().setSession(session);
    });

    // Check initial session
    const checkSession = async () => {
        const { data } = await supabase.auth.getSession();
        useAuthStore.getState().setSession(data.session);
    };
    checkSession();

    return () => {
      authListener?.subscription.unsubscribe();
    };

  }, []);

  const isAdminRoute = window.location.hash.startsWith('#/admin');

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-neutral-50 font-sans">
        <Toaster position="top-center" reverseOrder={false} />
        
        {/* Render public Header/Footer only for non-admin routes */}
        {!isAdminRoute && <Header />}

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/property/:id" element={<PropertyDetailsPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            
            {/* Standalone Login Page */}
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Protected Routes with dedicated layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<DashboardPage />} />
                <Route path="/admin/properties" element={<PropertiesListPage />} />
                <Route path="/admin/schedules" element={<SchedulesPage />} />
                <Route path="/admin/cities" element={<CitiesPage />} />
                <Route path="/admin/analytics" element={<AnalyticsPage />} />
                <Route path="/admin/users" element={<UsersPage />} />
                <Route path="/admin/settings" element={<SettingsPage />} />
              </Route>
            </Route>

          </Routes>
        </main>
        
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <Chatbot />}
      </div>
    </HashRouter>
  );
}

export default App;
