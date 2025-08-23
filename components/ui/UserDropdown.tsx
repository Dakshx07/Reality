import React, { useState, useEffect, useRef, useContext } from 'react';
import { UserIcon } from '../Icons';
import { AuthContext } from '../../context/AuthContext';

interface UserDropdownProps {
    user: { email: string };
    onLogout: () => void;
    onGoToDashboard?: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user, onLogout, onGoToDashboard }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center text-white hover:bg-neutral-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
                <UserIcon className="w-6 h-6" />
            </button>
            {isOpen && (
                <div 
                    className="absolute top-full right-0 mt-2 w-64 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg origin-top-right animate-[slide-down-fade_0.2s_ease-out]"
                >
                    <div className="p-4 border-b border-neutral-700">
                        <p className="text-sm text-gray-400">Signed in as</p>
                        <p className="font-semibold text-white truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                        {onGoToDashboard && (
                            <button
                                onClick={() => {
                                    onGoToDashboard();
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-gray-300 hover:bg-neutral-700 hover:text-white rounded-md transition-colors"
                            >
                                Go to Dashboard
                            </button>
                        )}
                         <button
                            onClick={() => {
                                onLogout();
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-md transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;