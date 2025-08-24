
import React, { useState, useEffect, useContext } from 'react';
import { RealityShieldLogo } from '../Icons';
import { AuthContext } from '../../context/AuthContext';
import UserDropdown from '../ui/UserDropdown';

interface NavbarProps {
  showAuth: () => void;
  showDashboard: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ showAuth, showDashboard }) => {
    const [scrolled, setScrolled] = useState(false);
    const { currentUser, logout } = useContext(AuthContext);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'How It Works', href: '#how-it-works' },
        { name: 'Demos', href: '#demos' },
        { name: 'Trust', href: '#trust' },
    ];

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/40 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <a href="#" className="flex items-center gap-2 opacity-0" style={{ animation: 'holographic-flicker-in 0.5s ease-out 0.2s forwards' }}>
                        <RealityShieldLogo className="h-8 w-8" />
                        <span className="font-clash text-2xl font-semibold">RealityShield</span>
                    </a>
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link, index) => (
                            <a 
                                key={link.name} 
                                href={link.href} 
                                className="animated-nav-link text-gray-300 text-lg font-medium opacity-0"
                                style={{ animation: `holographic-flicker-in 0.5s ease-out ${0.4 + index * 0.1}s forwards` }}
                            >
                                <span>{link.name}</span>
                                <span className="glitch-brackets" aria-hidden="true"></span>
                            </a>
                        ))}
                    </nav>
                    <div 
                        className="hidden md:flex items-center gap-4 opacity-0"
                        style={{ animation: `holographic-flicker-in 0.5s ease-out 0.8s forwards` }}
                    >
                        {currentUser ? (
                             <UserDropdown 
                                user={currentUser}
                                onLogout={logout}
                                onGoToDashboard={showDashboard}
                             />
                        ) : (
                            <>
                                <button
                                    onClick={showAuth}
                                    className="font-semibold text-gray-300 hover:text-white transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={showAuth}
                                    className="font-semibold bg-white text-black py-2 px-5 rounded-full hover:bg-gray-200 transform hover:scale-105 transition-all duration-300"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;