
import React from 'react';
import { LockClosedIcon, NeuralPatternIcon } from '../Icons';

interface FeatureLockProps {
  showLogin: () => void;
  showSignUp: () => void;
  title?: string;
  description?: string;
}

const FeatureLock: React.FC<FeatureLockProps> = ({ 
    showLogin, 
    showSignUp, 
    title = "Feature Locked",
    description = "Please log in or create an account to access this feature and join the fight against misinformation."
}) => {
  return (
    <div className="relative bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 z-0">
             <NeuralPatternIcon className="w-full h-full text-cyan-400/50" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 flex items-center justify-center bg-black/30 backdrop-blur-md border border-white/10 rounded-full mb-6">
                <LockClosedIcon className="w-10 h-10 text-neutral-400" />
            </div>
            <h2 className="font-clash text-4xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">{title}</h2>
            <p className="text-lg text-gray-400 mb-8 max-w-md">{description}</p>
            <div className="flex items-center gap-4">
                <button
                    onClick={showLogin}
                    className="font-semibold text-gray-300 hover:text-white transition-colors py-2 px-6"
                >
                    Login
                </button>
                <button
                    onClick={showSignUp}
                    className="font-semibold bg-white text-black py-2.5 px-6 rounded-full hover:bg-gray-200 transform hover:scale-105 transition-all duration-300"
                >
                    Sign Up
                </button>
            </div>
        </div>
    </div>
  );
};

export default FeatureLock;