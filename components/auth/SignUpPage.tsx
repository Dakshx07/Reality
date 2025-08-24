
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';

interface SignUpPageProps {
    showLogin: () => void;
    showSplash: () => void;
    onSignUpSuccess: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ showLogin, showSplash, onSignUpSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const { signup } = useContext(AuthContext);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setError('');
        if (email && password) {
            signup(email);
            // Explicitly call the success callback to trigger navigation
            onSignUpSuccess();
        }
    };

    const handleSwitchToLogin = () => {
        setIsExiting(true);
        setTimeout(showLogin, 300); // Match animation duration
    };

    const subtitle = (
        <p>
            Already have an account?{' '}
            <button onClick={handleSwitchToLogin} className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                Sign in
            </button>
        </p>
    );
    
    return (
        <AuthLayout
            title="Create your account"
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
                <div className="mb-4 animate-form-field-cascade" style={{ animationDelay: '200ms' }}>
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow-inner appearance-none border border-neutral-700 rounded-lg w-full py-3 px-4 bg-neutral-800 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
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
                <div className="mb-6 animate-form-field-cascade" style={{ animationDelay: '300ms' }}>
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="confirm-password">
                        Confirm Password
                    </label>
                    <input
                        className={`shadow-inner appearance-none border rounded-lg w-full py-3 px-4 bg-neutral-800 text-gray-200 leading-tight focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-500 focus:ring-red-500' : 'border-neutral-700 focus:ring-cyan-500'}`}
                        id="confirm-password"
                        type="password"
                        placeholder="******************"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
                </div>
                <div className="mt-8 flex items-center justify-between animate-form-field-cascade" style={{ animationDelay: '400ms' }}>
                    <button
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
                        type="submit"
                    >
                        Create Account
                    </button>
                </div>
                 <p className="mt-6 text-center text-gray-500 text-xs animate-form-field-cascade" style={{ animationDelay: '500ms' }}>
                    This is a simulated sign up. Any email/password will work.
                </p>
            </form>
        </AuthLayout>
    );
};

export default SignUpPage;