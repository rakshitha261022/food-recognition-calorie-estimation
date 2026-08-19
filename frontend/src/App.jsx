import React, { useState } from 'react';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Scanner from './pages/Scanner.jsx';
import Analytics from './pages/Analytics.jsx';
import Journal from './pages/Journal.jsx';
import AuthPage from './pages/AuthPage.jsx';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [scannedData, setScannedData] = useState(null); // Stores scan results for Analytics

  const handleLoginSuccess = (profileData) => {
    setUser(profileData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
    setScannedData(null);
  };

  // Called by Scanner when clicking "Proceed to Calibrate & Log"
  const handleProceedToAnalytics = (data) => {
    setScannedData(data);
    setCurrentPage('analytics');
  };

  // Resets temporary scan data and routes back to Dashboard
  const handleBackToDashboard = () => {
    setScannedData(null); // Clears previous scan data for next use
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    if (!user && (currentPage !== 'landing' && currentPage !== 'auth')) {
      return <AuthPage onLoginSuccess={handleLoginSuccess} />;
    }

    switch (currentPage) {
      case 'landing': 
        return <Landing />;
      case 'auth': 
        return <AuthPage onLoginSuccess={handleLoginSuccess} />;
      case 'dashboard': 
        return <Dashboard userContext={user} />;
      case 'scanner': 
        return <Scanner onProceedToAnalytics={handleProceedToAnalytics} />;
      case 'analytics': 
        return <Analytics scannedData={scannedData} userContext={user} onNavigate={setCurrentPage} />;
      case 'journal': 
        return <Journal userContext={user} onBackToDashboard={handleBackToDashboard} />;
      default: 
        return <Landing />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
      <nav className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('landing')}>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              NutriVision.ai
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1 md:space-x-3">
              <button 
                onClick={() => setCurrentPage('landing')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  currentPage === 'landing' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Home
              </button>
              
              {user && ['dashboard', 'scanner', 'analytics', 'journal'].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-200 ${
                    currentPage === page 
                      ? 'bg-emerald-500 text-slate-950 shadow-lg' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {user ? (
              <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
                <span className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                  {user.name}
                </span>
                <button 
                  onClick={handleLogout} 
                  className="p-2 text-slate-400 hover:text-red-400 bg-slate-950/40 border border-slate-800 rounded-lg hover:bg-slate-900 transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setCurrentPage('auth')} 
                className="bg-emerald-500 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs hover:bg-emerald-400 transition cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {renderPage()}
      </main>
    </div>
  );
}