
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

function App() {

  useEffect(() => {
    // Initialize Gemini Service once on app load
    // The API key is expected to be in environment variables
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      initGemini(apiKey);
    } else {
      console.warn("Gemini API key not found. AI features will be disabled.");
    }
  }, []);


  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-neutral-50 font-sans">
        <Toaster position="top-center" reverseOrder={false} />
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/property/:id" element={<PropertyDetailsPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            {/* Admin routes would be here, likely in a nested layout */}
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </HashRouter>
  );
}

export default App;
