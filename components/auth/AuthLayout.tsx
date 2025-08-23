
import React from 'react';
import { RealityShieldLogo } from '../Icons';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
  isPasswordFocused: boolean;
  animationClass: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, isPasswordFocused, animationClass }) => {
  const coreAnimationClass = isPasswordFocused ? 'animate-[core-scan_1s_ease-in-out_infinite]' : 'animate-[core-pulse_4s_ease-in-out_infinite]';

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 lg:p-8 animate-fade-in">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 bg-neutral-900/50 border border-neutral-800 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
        {/* Left side: Animated visual */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-neutral-900 border-r border-neutral-800 relative">
          <div className={`w-64 h-64 relative transition-all duration-500 ${coreAnimationClass}`}>
            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-3xl opacity-30"></div>
            <RealityShieldLogo className="w-full h-full text-cyan-400" />
          </div>
          <div className="text-center mt-8">
            <h3 className="font-clash text-3xl font-bold">RealityShield Core</h3>
            <p className="text-gray-400 mt-2">Securely authenticating your access to the truth.</p>
          </div>
        </div>

        {/* Right side: Form */}
        <div className={`w-full p-8 sm:p-12 flex flex-col justify-center ${animationClass}`}>
          <h2 className="text-center lg:text-left text-4xl font-clash font-bold text-white">
            {title}
          </h2>
          <div className="mt-2 text-center lg:text-left text-lg text-gray-400">
            {subtitle}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;