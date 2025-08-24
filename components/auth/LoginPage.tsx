
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';

interface LoginPageProps {
    showSignUp: () => void;
    showSplash: () => void;
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ showSignUp, showSplash, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const { login } = useContext(AuthContext);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulation: any email/password works
        if (email && password) {
            login(email);
            // Explicitly call the success callback to trigger navigation
            onLoginSuccess();
        }
    };

    const handleSwitchToSignUp = () => {
        setIsExiting(true);
        setTimeout(showSignUp, 300); // Match animation duration
    };
    
    const subtitle = (
        <p>
            Or{' '}
            <button onClick={handleSwitchToSignUp} className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                create a new account
            </button>
        </p>
    );

    return (
        <AuthLayout 
            title="Sign in to your account" 
            subtitle={subtitle} 
            isPasswordFocused={isPasswordFocused}
            animationClass={isExiting ? 'animate-content-slide-out' : 'animate-content-slide-in'}
        >
            <form className="mt-8" onSubmit={handleSubmit}>
                <div className="mb-4 animate-form-field-cascade" style={{ animationDelay: '100ms' }}>
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        className="shadow-inner appearance-none border border-neutral-700 rounded-lg w-full py-3 px-4 bg-neutral-800 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6 animate-form-field-cascade" style={{ animationDelay: '200ms' }}>
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow-inner appearance-none border border-neutral-700 rounded-lg w-full py-3 px-4 bg-neutral-800 text-gray-200 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                        id="password"
                        type="password"
                        placeholder="******************"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        required
                    />
                </div>
                <div className="mt-8 flex items-center justify-between animate-form-field-cascade" style={{ animationDelay: '300ms' }}>
                    <button
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
                        type="submit"
                    >
                        Sign In
                    </button>
                </div>
                <p className="mt-6 text-center text-gray-500 text-xs animate-form-field-cascade" style={{ animationDelay: '400ms' }}>
                    This is a simulated login. Any email/password will work.
                </p>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;