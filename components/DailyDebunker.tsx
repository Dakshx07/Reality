
import React from 'react';
import type { DailyDebunkerItem } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { InformationCircleIcon, CheckCircleIcon, ShieldExclamationIcon } from './Icons';

const dailyItems: DailyDebunkerItem[] = [
    { id: 1, type: 'text', content: '', statement: "A scientific study proved that chocolate accelerates weight loss.", isMisinfo: true, explanation: "This was a real, flawed study intentionally conducted by a journalist to show how easily bad science can be reported as fact by the media. Chocolate does not accelerate weight loss." },
    { id: 2, type: 'image', content: 'https://images.unsplash.com/photo-1549611016-3a70d67b5175?q=80&w=2070&auto=format&fit=crop', statement: "This photo shows a rare blue-phase lion, a recently discovered subspecies.", isMisinfo: true, explanation: "This is a digitally manipulated image. While lions have variations in coat color, a vibrant blue subspecies does not exist. The original photo features a standard tawny lion." },
    { id: 3, type: 'text', content: '', statement: "NASA has a program to train cats for space missions because they always land on their feet.", isMisinfo: true, explanation: "This is a humorous myth. While cats have an impressive 'righting reflex,' NASA does not train them for space missions due to numerous biological and practical challenges." },
    { id:4, type: 'text', content: '', statement: "The 'five-second rule' for dropped food has a basis in scientific fact.", isMisinfo: true, explanation: "Bacteria can contaminate food almost instantly. While factors like surface type and moisture matter, the duration is less important. It's safest not to eat food that has been dropped."},
    // Add more items to cycle through the days of the month
];

const getDailyItem = () => {
    const dayOfMonth = new Date().getDate();
    return dailyItems[dayOfMonth % dailyItems.length];
};

const DailyDebunker: React.FC = () => {
    const dailyItem = getDailyItem();
    const storageKey = `debunker-vote-${dailyItem.id}`;
    const [voted, setVoted] = useLocalStorage<'true' | 'false' | null>(storageKey, null);

    const handleVote = (vote: 'true' | 'false') => {
        setVoted(vote);
    };
    
    // Simulated community results
    const trueVotes = dailyItem.isMisinfo ? 34 : 87;
    const falseVotes = 100 - trueVotes;

    return (
        <div>
            <h1 className="font-clash text-5xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Daily Debunker</h1>
            <p className="text-xl text-gray-400 mb-8">Test your instincts. Is today's claim fact or fiction?</p>

            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                {dailyItem.type === 'image' && (
                    <img src={dailyItem.content} alt="Daily debunker content" className="w-full h-80 object-cover rounded-xl mb-6" />
                )}
                <p className="text-sm font-bold text-gray-400 tracking-widest">TODAY'S CLAIM:</p>
                <h3 className="text-3xl font-semibold text-white my-4">{dailyItem.statement}</h3>

                {!voted ? (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        <button onClick={() => handleVote('true')} className="py-4 text-lg font-bold bg-green-600/80 hover:bg-green-600 rounded-lg transition-all transform hover:scale-105">
                            <CheckCircleIcon className="w-6 h-6 inline-block mr-2"/> Fact / True
                        </button>
                        <button onClick={() => handleVote('false')} className="py-4 text-lg font-bold bg-red-600/80 hover:bg-red-600 rounded-lg transition-all transform hover:scale-105">
                             <ShieldExclamationIcon className="w-6 h-6 inline-block mr-2"/> Fiction / Misinfo
                        </button>
                    </div>
                ) : (
                    <div className="mt-8 animate-fade-in-up">
                        <h4 className="font-semibold text-lg text-gray-300">Community Verdict:</h4>
                        <div className="mt-2 space-y-3">
                            {/* True Bar */}
                            <div className="w-full bg-black/20 rounded-lg p-3 border border-white/10">
                                <div className="flex justify-between items-center text-sm font-semibold">
                                    <span className="text-green-300">Voted Fact / True</span>
                                    <span className="text-gray-300">{trueVotes}%</span>
                                </div>
                                <div className="w-full bg-neutral-700 rounded-full h-2.5 mt-1">
                                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${trueVotes}%` }}></div>
                                </div>
                            </div>
                             {/* False Bar */}
                            <div className="w-full bg-black/20 rounded-lg p-3 border border-white/10">
                                <div className="flex justify-between items-center text-sm font-semibold">
                                    <span className="text-red-300">Voted Fiction / Misinfo</span>
                                    <span className="text-gray-300">{falseVotes}%</span>
                                </div>
                                <div className="w-full bg-neutral-700 rounded-full h-2.5 mt-1">
                                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${falseVotes}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 bg-cyan-900/20 p-4 rounded-lg border border-cyan-500/30">
                            <p className="font-semibold text-cyan-300 flex items-center gap-2">
                                <InformationCircleIcon className="w-6 h-6"/> The Verdict
                            </p>
                             <p className="font-bold text-xl mt-2">This claim is {dailyItem.isMisinfo ? 'FICTION' : 'FACT'}.</p>
                            <p className="text-gray-300 mt-2">{dailyItem.explanation}</p>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyDebunker;
