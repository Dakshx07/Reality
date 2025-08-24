
import React, { useState, useEffect } from 'react';
import { simulateSpread } from '../services/geminiService';
import type { SpreadSimulationResult } from '../types';
import { BrainIcon, GlobeAltIcon, UsersIcon, ChatBubbleBottomCenterTextIcon } from './Icons';

const countryCoords: { [key: string]: { top: string, left: string } } = {
    'USA': { top: '38%', left: '25%' },
    'Canada': { top: '30%', left: '25%' },
    'Brazil': { top: '65%', left: '35%' },
    'UK': { top: '35%', left: '48%' },
    'Germany': { top: '36%', left: '52%' },
    'France': { top: '38%', left: '50%' },
    'Russia': { top: '35%', left: '65%' },
    'China': { top: '40%', left: '78%' },
    'India': { top: '48%', left: '68%' },
    'Australia': { top: '75%', left: '83%' },
    'South Africa': { top: '78%', left: '55%' },
    'Nigeria': { top: '55%', left: '51%' },
    'Japan': { top: '40%', left: '85%' },
    'Mexico': { top: '45%', left: '22%' },
    'default': { top: '50%', left: '50%'},
};

const DataCard: React.FC<{title: string; children: React.ReactNode; icon: React.ReactNode}> = ({title, children, icon}) => (
    <div className="bg-black/20 border border-white/10 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-400 flex items-center gap-2 mb-2">
            {icon}
            {title}
        </h4>
        <div className="text-gray-200">{children}</div>
    </div>
);


const SpreadVisualization: React.FC = () => {
    const [claim, setClaim] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<SpreadSimulationResult | null>(null);
    const [currentDay, setCurrentDay] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (result) {
            timer = setInterval(() => {
                setCurrentDay(prev => (prev < 14 ? prev + 1 : 0));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [result]);

    const handleRunSimulation = async () => {
        if (!claim.trim()) {
            setError('Please enter a claim to simulate.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        setCurrentDay(0);
        try {
            const simResult = await simulateSpread(claim);
            setResult(simResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const nodesForDay = result?.spreadTimeline.filter(s => s.day <= currentDay) || [];
    const originCoords = result ? countryCoords[result.originCountry] || countryCoords.default : null;

    return (
    <div className="max-w-7xl mx-auto">
        <h1 className="font-clash text-5xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Global Threat Nexus</h1>
        <p className="text-xl text-gray-400 mb-8">Run AI-powered simulations to visualize the potential spread of misinformation.</p>
      
        <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <input type="text" value={claim} onChange={(e) => setClaim(e.target.value)} placeholder="e.g., 'Miracle cure for COVID-19 discovered...'" className="flex-grow p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all text-lg shadow-inner"/>
                <button onClick={handleRunSimulation} disabled={isLoading} className="w-full sm:w-auto bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-cyan-500 disabled:bg-neutral-700 disabled:cursor-not-allowed transition-colors">
                    {isLoading ? 'Simulating...' : 'Run Simulation'}
                </button>
            </div>
             {error && <div className="mt-4 p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-md">{error}</div>}
        </div>
        
        <div className="mt-8">
            {isLoading && (
                <div className="w-full flex flex-col items-center justify-center bg-black/20 border border-white/10 rounded-2xl p-8 my-8 text-center animate-fade-in h-96">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 rounded-full bg-cyan-900 animate-ai-core-pulse"></div>
                        <BrainIcon className="absolute inset-0 m-auto w-12 h-12 text-cyan-300" />
                    </div>
                    <h3 className="mt-4 text-2xl font-clash font-semibold text-white">Generating Fictional Scenario</h3>
                    <p className="text-gray-400 mt-1">AI is crafting a realistic spread model based on the claim...</p>
                </div>
            )}

            {result && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                    <div className="lg:col-span-2 bg-black/20 border border-white/10 rounded-2xl p-4 relative overflow-hidden aspect-video">
                        <div className="absolute inset-0 bg-center bg-no-repeat opacity-20" style={{ backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')`, backgroundSize: 'contain' }}></div>
                        
                        {/* Origin Node */}
                        {originCoords && (
                             <div className="absolute w-4 h-4" style={{ top: originCoords.top, left: originCoords.left, transform: 'translate(-50%, -50%)' }}>
                                 <div className="absolute inset-0 rounded-full bg-yellow-400 animate-map-dot-pulse"></div>
                             </div>
                        )}
                       
                        {/* Spread Nodes */}
                        {nodesForDay.map((node, i) => {
                            const coords = countryCoords[node.country] || null;
                            if (!coords) return null;
                            const size = 4 + Math.log(node.reach) * 0.5;
                            return (
                                <div key={`${i}-${node.country}`} className="absolute rounded-full bg-red-500/80 animate-fade-in" style={{
                                    top: coords.top, left: coords.left,
                                    width: `${size}px`, height: `${size}px`,
                                    transform: `translate(-50%, -50%)`,
                                    transition: `all 0.5s ease`,
                                }}></div>
                            )
                        })}
                        <div className="absolute bottom-2 left-2 bg-black/50 p-2 rounded-lg text-xs font-mono">
                            <span className="text-red-400 font-bold">DISCLAIMER:</span> THIS IS AN AI-GENERATED, FICTIONAL SIMULATION FOR EDUCATIONAL PURPOSES.
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-black/20 border border-white/10 rounded-lg p-4">
                             <label htmlFor="timeline-slider" className="text-sm font-semibold text-gray-400 flex justify-between"><span>Simulation Timeline</span> <span className="font-mono">Day {currentDay}/14</span></label>
                            <input id="timeline-slider" type="range" min="0" max="14" value={currentDay} onChange={(e) => setCurrentDay(parseInt(e.target.value))} className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer mt-2" />
                        </div>
                        <DataCard title="Origin Point" icon={<GlobeAltIcon className="w-5 h-5"/>}>
                            <p className="font-bold text-lg">{result.originCountry}</p>
                        </DataCard>
                         <DataCard title="AI Narrative" icon={<ChatBubbleBottomCenterTextIcon className="w-5 h-5"/>}>
                            <p className="text-sm">{result.narrative}</p>
                        </DataCard>
                         <DataCard title="Target Demographics" icon={<UsersIcon className="w-5 h-5"/>}>
                             <div className="flex flex-wrap gap-2 text-sm">
                                {result.targetDemographics.map(d => <span key={d} className="bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded">{d}</span>)}
                            </div>
                        </DataCard>
                         <DataCard title="Primary Vectors" icon={<BrainIcon className="w-5 h-5"/>}>
                            <div className="flex flex-wrap gap-2 text-sm">
                                {result.primaryVectors.map(v => <span key={v} className="bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded">{v}</span>)}
                            </div>
                        </DataCard>
                    </div>
                </div>
            )}
        </div>
    </div>
    );
};

export default SpreadVisualization;