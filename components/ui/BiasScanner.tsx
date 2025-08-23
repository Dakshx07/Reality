import React from 'react';

interface BiasScannerProps {
    score: number;
    flags: string[];
    alternatives: { name: string, url: string }[];
}

const BiasScanner: React.FC<BiasScannerProps> = ({ score, flags, alternatives }) => {
    const gaugeRotation = (score / 100) * 180;
    const scoreColor = score < 40 ? 'text-red-400' : score < 70 ? 'text-yellow-400' : 'text-green-400';
    const scoreLabel = score < 40 ? 'High Bias' : score < 70 ? 'Moderate Bias' : 'Low Bias / Neutral';

    return (
        <div className="bg-black/20 p-6 rounded-lg border border-white/10">
            <h3 className="text-2xl font-clash font-semibold text-gray-50 mb-4">Bias & Credibility Scan</h3>
            <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="relative w-full max-w-xs mx-auto aspect-square flex flex-col items-center justify-center">
                    <svg viewBox="0 0 100 50" className="w-full">
                        <path d="M 10 50 A 40 40 0 0 1 90 50" stroke="currentColor" className="text-neutral-700" strokeWidth="8" fill="none" />
                        <path d="M 10 50 A 40 40 0 0 1 90 50" stroke="url(#gradient)" strokeWidth="8" fill="none" strokeDasharray="125.6" strokeDashoffset={125.6 - (score/100 * 125.6)} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                        <defs>
                            <linearGradient id="gradient">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="50%" stopColor="#facc15" />
                                <stop offset="100%" stopColor="#4ade80" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 text-center">
                        <p className={`font-clash text-5xl font-bold ${scoreColor}`}>{score}</p>
                        <p className="text-sm font-semibold text-gray-400">{scoreLabel}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-300">Potential Flags</h4>
                        {flags && flags.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {flags.map(flag => <span key={flag} className="px-2.5 py-1 text-sm font-medium rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/30">{flag}</span>)}
                            </div>
                        ) : (
                             <p className="text-sm text-gray-500 mt-1">No major bias flags detected.</p>
                        )}
                    </div>
                     <div>
                        <h4 className="font-semibold text-gray-300">Alternative Sources</h4>
                        {alternatives && alternatives.length > 0 ? (
                            <div className="flex flex-col gap-2 mt-2">
                                {alternatives.map(alt => (
                                    <a href={alt.url} key={alt.name} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline hover:text-cyan-300 bg-cyan-900/20 px-3 py-1.5 rounded-md transition-colors">
                                        {alt.name} &rarr;
                                    </a>
                                ))}
                            </div>
                        ) : (
                             <p className="text-sm text-gray-500 mt-1">No alternative sources found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BiasScanner;