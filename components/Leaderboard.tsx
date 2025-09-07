
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { TrophyIcon } from './Icons';

// Mock data for other users on the leaderboard
const mockLeaderboard = [
  { id: 'user-1', email: 'sentinel@reality.sh', score: 1250 },
  { id: 'user-2', email: 'verifier@truth.net', score: 1180 },
  { id: 'user-3', email: 'agent_smith@matrix.ai', score: 990 },
  { id: 'user-4', email: 'oracle@protocol.org', score: 950 },
  { id: 'user-5', email: 'factfinder@web.com', score: 870 },
  { id: 'user-6', email: 'debunker_pro@mail.dev', score: 760 },
  { id: 'user-7', email: 'truthseeker@domain.io', score: 640 },
];

const generateUsername = (email: string) => {
    return email.split('@')[0];
};

const Leaderboard: React.FC = () => {
    const { currentUser } = useContext(AuthContext);
    const [challengeScore] = useLocalStorage<number>('challengeScore', 0);

    // Combine mock data with the current user's data
    let combinedLeaderboard = [...mockLeaderboard];
    if (currentUser) {
        // Remove mock entry if email matches current user to avoid duplicates
        combinedLeaderboard = combinedLeaderboard.filter(user => user.email !== currentUser.email);
        combinedLeaderboard.push({
            id: currentUser.id,
            email: currentUser.email,
            score: challengeScore
        });
    }

    // Sort by score in descending order
    const sortedLeaderboard = combinedLeaderboard.sort((a, b) => b.score - a.score);

    return (
        <div>
            <h1 className="font-clash text-5xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">Community Leaderboard</h1>
            <p className="text-xl text-gray-400 mb-8">See how you rank among the top Truth Defenders.</p>

            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-400 uppercase tracking-wider w-16">Rank</th>
                            <th className="p-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Player</th>
                            <th className="p-4 text-sm font-semibold text-gray-400 uppercase tracking-wider text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedLeaderboard.map((player, index) => {
                            const isCurrentUser = currentUser && player.id === currentUser.id;
                            const rank = index + 1;
                            
                            let rankDisplay: React.ReactNode;
                            if (rank === 1) rankDisplay = <TrophyIcon className="w-6 h-6 text-yellow-400" />;
                            else if (rank === 2) rankDisplay = <TrophyIcon className="w-6 h-6 text-gray-300" />;
                            else if (rank === 3) rankDisplay = <TrophyIcon className="w-6 h-6 text-yellow-600" />;
                            else rankDisplay = <span className="font-mono">{rank}</span>;

                            return (
                                <tr key={player.id} className={`border-b border-white/5 last:border-b-0 transition-colors ${isCurrentUser ? 'bg-cyan-500/10' : 'hover:bg-white/5'}`}>
                                    <td className="p-4 text-lg font-semibold text-center">
                                        {rankDisplay}
                                    </td>
                                    <td className={`p-4 font-semibold ${isCurrentUser ? 'text-cyan-300' : 'text-gray-200'}`}>
                                        {generateUsername(player.email)}
                                        {isCurrentUser && <span className="ml-2 text-xs text-cyan-400">(You)</span>}
                                    </td>
                                    <td className="p-4 font-mono text-xl text-right text-gray-300">{player.score}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {!currentUser && (
                <p className="text-center text-gray-500 mt-4">Log in to see your score on the leaderboard.</p>
            )}
        </div>
    );
};

export default Leaderboard;
