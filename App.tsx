import React, { useState, useContext, useEffect } from 'react';
import SplashPage from './components/SplashPage';
import Dashboard from './components/Dashboard';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import { AuthContext } from './context/AuthContext';
import GlobalNav from './components/GlobalNav';

export type View = 'splash' | 'login' | 'signup' | 'dashboard';

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
  const showLogin = () => setView('login');
  const showSignUp = () => setView('signup');
  const showDashboard = () => setView('dashboard');

  const renderView = () => {
    switch (view) {
      case 'splash':
        return <SplashPage showLogin={showLogin} showSignUp={showSignUp} showDashboard={showDashboard} />;
      case 'login':
        // onLoginSuccess explicitly triggers the redirect to the dashboard.
        return <LoginPage showSignUp={showSignUp} showSplash={showSplash} onLoginSuccess={showDashboard} />;
      case 'signup':
        // onSignUpSuccess explicitly triggers the redirect to the dashboard.
        return <SignUpPage showLogin={showLogin} showSplash={showSplash} onSignUpSuccess={showDashboard} />;
      case 'dashboard':
         // This is a protected view. If user is not logged in, redirect to sign up.
         if (!currentUser) {
            return <SignUpPage showLogin={showLogin} showSplash={showSplash} onSignUpSuccess={showDashboard} />;
         }
        // Pass showSplash down to allow returning to the landing page.
        return <Dashboard showSplash={showSplash} />;
      default:
        return <SplashPage showLogin={showLogin} showSignUp={showSignUp} showDashboard={showDashboard} />;
    }
  };

  return (
    <main className="text-[#EAEAEA] min-h-screen w-full antialiased overflow-x-hidden relative">
       <div className="fixed inset-0 z-0 aurora-bg pointer-events-none"></div>
        {view !== 'splash' && (
            <GlobalNav 
                view={view}
                showSplash={showSplash}
                showLogin={showLogin}
                showSignUp={showSignUp}
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