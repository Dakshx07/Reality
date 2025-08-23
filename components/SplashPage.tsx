import React, { useContext } from 'react';
import HeroSection from './landing/HeroSection';
import DeepfakeDemo from './landing/DeepfakeDemo';
import MisinfoDnaDemo from './landing/MisinfoDnaDemo';
import ArDemo from './landing/ArDemo';
import CtaSection from './landing/CtaSection';
import FeaturesScroller from './landing/FeaturesScroller';
import Navbar from './landing/Navbar';
import HowItWorks from './landing/HowItWorks';
import TrustSection from './landing/TrustSection';
import TechStackScroller from './landing/TechStackScroller';
import Footer from './landing/Footer';
import ThreatMatrix from './landing/ThreatMatrix';
import { AuthContext } from '../context/AuthContext';

interface SplashPageProps {
  showLogin: () => void;
  showSignUp: () => void;
  showDashboard: () => void;
}

const SplashPage: React.FC<SplashPageProps> = ({ showLogin, showSignUp, showDashboard }) => {
  const { currentUser } = useContext(AuthContext);
  
  const handleLaunch = () => {
    if (currentUser) {
      showDashboard();
    } else {
      showSignUp();
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
        <Navbar showLogin={showLogin} showSignUp={showSignUp} showDashboard={showDashboard} />
        <HeroSection onLaunch={handleLaunch} />
        <FeaturesScroller />
        <HowItWorks />
        <ThreatMatrix />
        
        <section id="demos" className="w-full py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-600/20 via-cyan-600/20 to-indigo-600/20 opacity-30 animate-[gradient-pan_15s_ease_infinite]" style={{backgroundSize: '400% 400%'}}></div>
            <div className="relative z-10 max-w-7xl mx-auto space-y-24">
              <div className="text-center">
                  <h2 className="font-clash text-5xl md:text-7xl font-bold">
                     Live AI Demos
                  </h2>
                  <p className="text-lg text-gray-400 mt-6 max-w-3xl mx-auto">
                      Experience the power of RealityShield firsthand. Interact with our core detection modules to see how we deconstruct digital threats in real time.
                  </p>
              </div>
              <DeepfakeDemo />
              <MisinfoDnaDemo />
            </div>
        </section>

        <ArDemo />
        <TrustSection />
        <TechStackScroller />
        <CtaSection onLaunch={handleLaunch} />
        <Footer />
    </div>
  );
};

export default SplashPage;