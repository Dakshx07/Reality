
import React, { useState, useContext, useEffect } from 'react';
import SplashPage from './components/SplashPage';
import Dashboard from './components/Dashboard';
import AuthPage from './components/auth/AuthPage';
import { AuthContext } from './context/AuthContext';
import GlobalNav from './components/GlobalNav';

export type View = 'splash' | 'auth' | 'dashboard';

function App() {
  const [view, setView] = useState<View>('splash');
  const { currentUser } = useContext(AuthContext);

  // This useEffect handles LOGOUT logic.
  // If a user logs out while on the dashboard, send them back to the splash page.
  useEffect(() => {
    if (!currentUser && view === 'dashboard') {
      setView('splash');
    }
  }, [currentUser, view]);

  const showSplash = () => setView('splash');
  const showAuth = () => setView('auth');
  const showDashboard = () => setView('dashboard');

  const renderView = () => {
    switch (view) {
      case 'splash':
        return <SplashPage showAuth={showAuth} showDashboard={showDashboard} />;
      case 'auth':
        // onAuthSuccess explicitly triggers the redirect to the dashboard.
        return <AuthPage onAuthSuccess={showDashboard} />;
      case 'dashboard':
         // This is a protected view. If user is not logged in, redirect to auth page.
         if (!currentUser) {
            return <AuthPage onAuthSuccess={showDashboard} />;
         }
        // Pass showSplash down to allow returning to the landing page.
        return <Dashboard showSplash={showSplash} />;
      default:
        return <SplashPage showAuth={showAuth} showDashboard={showDashboard} />;
    }
  };

  return (
    <main className="text-[#EAEAEA] min-h-screen w-full antialiased overflow-x-hidden relative">
       <div className="fixed inset-0 z-0 aurora-bg pointer-events-none"></div>
        {view !== 'splash' && (
            <GlobalNav 
                view={view}
                showSplash={showSplash}
                showAuth={showAuth}
                showDashboard={showDashboard}
            />
        )}
       <div className="relative z-10">
        {renderView()}
       </div>
    </main>
  );
}

export default App;