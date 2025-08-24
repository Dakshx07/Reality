
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { RealityShieldLogo, EnvelopeIcon, LockClosedIcon } from '../Icons';

interface AuthPageProps {
    onAuthSuccess: () => void;
}

type AuthMode = 'login' | 'signup';

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
    const [authMode, setAuthMode] = useState<AuthMode>('login');
    const { login, signup } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleModeChange = (mode: AuthMode) => {
        if (mode === authMode) return;
        setAuthMode(mode);
        // Reset fields and errors
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (authMode === 'signup' && password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (email && password) {
            if (authMode === 'login') {
                login(email);
            } else {
                signup(email);
            }
            onAuthSuccess();
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">
                {/* Left Visual Panel */}
                <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-neutral-900/50 border-r border-white/10 relative overflow-hidden animate-[auth-panel-left-enter_0.7s_cubic-bezier(0.25,1,0.5,1)_forwards]">
                    <div className="absolute inset-0 z-0 opacity-20">
                        <div className="absolute top-0 left-0 w-full h-[200%]" style={{ backgroundImage: 'radial-gradient(ellipse 1px 1px at 50% 50%, #fff, transparent)', backgroundSize: '20px 20px' }}></div>
                    </div>
                     <div className="relative z-10 text-center">
                        <RealityShieldLogo className="h-24 w-24 mx-auto" />
                        <h1 className="font-clash text-5xl font-bold mt-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400">
                            Access Granted
                        </h1>
                        <p className="text-neutral-300 mt-4 text-lg max-w-sm">
                            Authenticate to deploy RealityShield and begin your mission to secure the digital truth.
                        </p>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className="w-full p-8 sm:p-12 flex flex-col justify-center animate-[auth-panel-right-enter_0.7s_cubic-bezier(0.25,1,0.5,1)_forwards]">
                    {/* Header/Switcher */}
                    <div className="flex items-baseline gap-6 mb-8">
                        <button onClick={() => handleModeChange('login')}>
                            <h2 className={`font-clash text-4xl font-bold transition-colors ${authMode === 'login' ? 'text-white' : 'text-neutral-600 hover:text-neutral-400'}`}>
                                Sign In
                            </h2>
                        </button>
                         <button onClick={() => handleModeChange('signup')}>
                            <h2 className={`font-clash text-4xl font-bold transition-colors ${authMode === 'signup' ? 'text-white' : 'text-neutral-600 hover:text-neutral-400'}`}>
                                Sign Up
                            </h2>
                        </button>
                    </div>

                    {/* Form - Inlined to prevent re-render issues */}
                    <form key={authMode} onSubmit={handleSubmit} className="space-y-6 animate-form-content-in">
                         <div className="relative animate-form-field-cascade" style={{ animationDelay: '100ms' }}>
                            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
                            <input
                                className="shadow-inner appearance-none border border-neutral-700 rounded-lg w-full py-3 pl-12 pr-4 bg-neutral-900/50 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                                id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                         <div className="relative animate-form-field-cascade" style={{ animationDelay: '200ms' }}>
                             <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
                            <input
                                className="shadow-inner appearance-none border border-neutral-700 rounded-lg w-full py-3 pl-12 pr-4 bg-neutral-900/50 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                                id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        {authMode === 'signup' && (
                            <div className="animate-form-field-cascade" style={{ animationDelay: '300ms' }}>
                                <div className="relative">
                                    <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
                                    <input
                                        className={`shadow-inner appearance-none border rounded-lg w-full py-3 pl-12 pr-4 bg-neutral-900/50 text-gray-200 leading-tight focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-500 focus:ring-red-500' : 'border-neutral-700 focus:ring-cyan-500'}`}
                                        id="confirm-password" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                </div>
                                {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
                            </div>
                        )}
                        <div className="pt-2 animate-form-field-cascade" style={{ animationDelay: authMode === 'signup' ? '400ms' : '300ms' }}>
                             <button
                                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all transform hover:scale-[1.02]"
                                type="submit">
                                {authMode === 'login' ? 'Sign In' : 'Create Account'}
                            </button>
                        </div>
                         <p className="text-center text-gray-500 text-xs animate-form-field-cascade" style={{ animationDelay: authMode === 'signup' ? '500ms' : '400ms' }}>
                            This is a simulated auth. Any email/password will work.
                        </p>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default AuthPage;