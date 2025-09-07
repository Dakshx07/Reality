
import React, { useState, useEffect, useRef } from 'react';
import { UserIcon, TrophyIcon } from '../Icons';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { LeaderboardEntry } from '../../types';

interface UserDropdownProps {
    user: { id: string, email: string };
    onLogout: () => void;
    onGoToDashboard?: () => void;
}

const generateUsername = (email: string) => {
    return email.split('@')[0];
};

// Mock data to calculate rank - consistent with Leaderboard component
const mockLeaderboard: Omit<LeaderboardEntry, 'id'>[] = [
  { email: 'sentinel@reality.sh', score: 1250 },
  { email: 'verifier@truth.net', score: 1180 },
  { email: 'agent_smith@matrix.ai', score: 990 },
  { email: 'oracle@protocol.org', score: 950 },
  { email: 'factfinder@web.com', score: 870 },
  { email: 'debunker_pro@mail.dev', score: 760 },
  { email: 'truthseeker@domain.io', score: 640 },
];

const UserDropdown: React.FC<UserDropdownProps> = ({ user, onLogout, onGoToDashboard }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [challengeScore] = useLocalStorage<number>('challengeScore', 0);
    const [rank, setRank] = useState<number | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        let combinedLeaderboard = [...mockLeaderboard.map(u => ({...u, id: u.email}))];
        combinedLeaderboard = combinedLeaderboard.filter(u => u.email !== user.email);
        combinedLeaderboard.push({ id: user.id, email: user.email, score: challengeScore });
        const sorted = combinedLeaderboard.sort((a, b) => b.score - a.score);
        const userIndex = sorted.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            setRank(userIndex + 1);
        }
    }, [challengeScore, user]);

    const username = generateUsername(user.email);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 bg-neutral-800/50 border border-neutral-700 rounded-full flex items-center justify-center text-white hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-cyan-400"
            >
                <UserIcon className="w-6 h-6" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl bg-neutral-900 border border-neutral-700 shadow-2xl shadow-black/50 ring-1 ring-black ring-opacity-5 focus:outline-none animate-slide-down-fade overflow-hidden">
                    <div className="p-4 border-b border-neutral-700 opacity-0" style={{animation: 'staggered-fade-in 0.5s 0.1s forwards'}}>
                        <p className="text-lg font-semibold text-white truncate">{username}</p>
                        <p className="text-sm text-neutral-400 truncate">{user.email}</p>
                    </div>
                    <div className="p-4 space-y-3 opacity-0" style={{animation: 'staggered-fade-in 0.5s 0.2s forwards'}}>
                        <div className="flex items-center justify-between">
                            <span className="text-neutral-400 flex items-center gap-2"><TrophyIcon className="w-5 h-5"/> Score</span>
                            <span className="font-bold text-lg text-cyan-300">{challengeScore}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-neutral-400 flex items-center gap-2"><TrophyIcon className="w-5 h-5"/> Rank</span>
                            <span className="font-bold text-lg text-cyan-300">{rank ? `#${rank}` : 'N/A'}</span>
                        </div>
                    </div>
                    {onGoToDashboard && (
                         <div className="p-2 border-t border-neutral-700 opacity-0" style={{animation: 'staggered-fade-in 0.5s 0.3s forwards'}}>
                            <button onClick={() => { onGoToDashboard(); setIsOpen(false); }} className="w-full text-left rounded-md px-3 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-800 transition-colors">
                                Go to Dashboard
                            </button>
                        </div>
                    )}
                    <div className={`p-2 ${onGoToDashboard ? '' : 'border-t border-neutral-700'} opacity-0`} style={{animation: 'staggered-fade-in 0.5s 0.4s forwards'}}>
                        <button onClick={onLogout} className="w-full text-left rounded-md px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
