import React, { useState, useMemo, useContext } from 'react';
import { TrendingUpIcon, GlobeAltIcon } from './Icons';

const SpreadVisualization: React.FC = () => {
    const [claim, setClaim] = useState('');
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [isPredicting, setIsPredicting] = useState(false);
    const [reach, setReach] = useState(50);
    const [timeHorizon, setTimeHorizon] = useState(48);

    const handleVisualize = () => {
        if (!claim.trim()) return;
        setIsVisualizing(true);
    };
    
    const predictedSpread = useMemo(() => {
        return Math.floor((reach / 100) * (timeHorizon / 24) * 1000000 + Math.random() * 50000);
    }, [reach, timeHorizon]);

    const HistoricalView = () => (
        <div className="mt-8 animate-fade-in">
            <h3 className="font-clash text-2xl mb-4 text-cyan-300">Historical Spread Analysis (Simulated)</h3>
            <div className="relative w-full aspect-video bg-black/20 rounded-lg p-2 overflow-hidden border border-white/10">
                <svg viewBox="0 0 1000 500" className="w-full h-full">
                    <path d="M500 5C249 5 43 103 43 250s206 245 457 245c251 0 457-103 457-245S751 5 500 5zM893 250c0 40-31 77-88 110-38 22-83 39-132 50-48 10-100 15-155 15-73 0-141-9-200-25-33-9-64-21-92-35-28-14-53-31-75-49-22-18-41-39-56-62-15-23-26-48-33-74-7-26-11-53-11-80s4-54 11-80c7-26 18-51 33-74 15-23 34-44 56-62 22-18 47-35 75-49 28-14 59-26 92-35 59-16 127-25 200-25 55 0 107 5 155 15 49 11 94 28 132 50 57 33 88 70 88 110z" fill="#1f2937" />
                    <circle cx="700" cy="280" r="10" fill="#fde047" className="animate-pulse" />
                    <path d="M700 280 Q 500 150 300 200" stroke="#f87171" strokeWidth="4" fill="none" />
                    <path d="M700 280 Q 600 380 450 350" stroke="#f87171" strokeWidth="4" fill="none" />
                    <path d="M700 280 Q 850 250 880 150" stroke="#f87171" strokeWidth="4" fill="none" />
                    <circle cx="300" cy="200" r="7" fill="#ef4444" />
                    <circle cx="450" cy="350" r="7" fill="#ef4444" />
                    <circle cx="880" cy="150" r="7" fill="#ef4444" />
                </svg>
            </div>
        </div>
    );

    const PredictiveView = () => (
        <div className="mt-8 animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-black/20 rounded-lg p-6 border border-white/10">
                <h3 className="font-clash text-2xl text-purple-300">Predicted Spread Over Time</h3>
                <div className="w-full h-64 flex items-end gap-2 mt-4 p-4 bg-black/20 rounded">
                    {[12, 24, 36, 48].map(h => {
                        const barHeight = Math.min(100, ((predictedSpread / 1500000) * 100 * (h/48) * (reach/50)));
                        return (
                            <div key={h} className="w-full h-full flex flex-col justify-end items-center">
                                <div className="w-3/4 bg-purple-500/50 rounded-t-md transition-all duration-500" style={{height: `${barHeight}%`}}></div>
                                <span className="text-xs text-gray-500 mt-1">{h}h</span>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="bg-black/20 border border-white/10 rounded-lg p-6 flex flex-col">
                <h3 className="font-clash text-2xl text-purple-300">Simulation Controls</h3>
                <div className="mt-4">
                    <label htmlFor="reach-slider" className="text-sm font-semibold text-gray-400 flex justify-between"><span>Potential Reach</span> <span>{reach}%</span></label>
                    <input id="reach-slider" type="range" min="0" max="100" value={reach} onChange={(e) => setReach(parseInt(e.target.value))} className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div className="mt-4">
                    <label htmlFor="time-horizon-slider" className="text-sm font-semibold text-gray-400 flex justify-between"><span>Time Horizon</span> <span>{timeHorizon}h</span></label>
                    <input id="time-horizon-slider" type="range" min="1" max="72" value={timeHorizon} onChange={(e) => setTimeHorizon(parseInt(e.target.value))} className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div className="mt-auto pt-4 border-t border-white/10">
                     <p className="text-sm text-gray-400">Predicted Impact:</p>
                     <p className="text-3xl font-bold text-purple-300">{predictedSpread.toLocaleString()} users</p>
                     <p className="text-xs text-gray-500">across US, India, UK (simulated)</p>
                </div>
            </div>
        </div>
    );

    return (
    <div>
        <div className="flex justify-between items-start">
            <div>
                <h1 className="font-clash text-5xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Global Threat Nexus</h1>
                <p className="text-xl text-gray-400 mb-8">Analyze historical spread or predict future impact of misinformation.</p>
            </div>
        </div>
      
        <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            <div className="flex flex-col sm:flex-row gap-4">
                <input type="text" value={claim} onChange={(e) => setClaim(e.target.value)} placeholder="e.g., 'Miracle cure for COVID-19 discovered...'" className="flex-grow p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all text-lg shadow-inner"/>
                <div className="flex-shrink-0 flex gap-2">
                    <button onClick={handleVisualize} disabled={!claim.trim()} className="w-full sm:w-auto bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-cyan-500 disabled:bg-neutral-700 disabled:cursor-not-allowed transition-colors">Visualize</button>
                    <button onClick={() => setIsPredicting(!isPredicting)} className="w-full sm:w-auto flex items-center gap-2 font-semibold py-3 px-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                        {isPredicting ? <><GlobeAltIcon className="w-5 h-5"/> Historical</> : <><TrendingUpIcon className="w-5 h-5"/> Predict</>}
                    </button>
                </div>
            </div>

            {isVisualizing && (isPredicting ? <PredictiveView /> : <HistoricalView />)}
        </div>
    </div>
    );
};

export default SpreadVisualization;