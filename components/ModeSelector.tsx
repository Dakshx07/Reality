import React from 'react';
import type { AnalysisMode } from '../types';
import { DocumentTextIcon, PhotoIcon, CubeTransparentIcon, GlobeAltIcon, RealityShieldLogo, PuzzlePieceIcon, TrendingUpIcon } from './Icons';

interface SidebarProps {
  currentMode: AnalysisMode;
  onSelectMode: (mode: AnalysisMode) => void;
  onShowSplash: () => void;
}

interface NavMode {
    id: AnalysisMode;
    name: string;
    icon: React.ReactNode;
}

const coreAnalysis: NavMode[] = [
    { id: 'text', name: 'Text Analysis', icon: <DocumentTextIcon className="h-6 w-6" /> },
    { id: 'media', name: 'Deepfake Radar', icon: <PhotoIcon className="h-6 w-6" /> },
    { id: 'ar', name: 'AR Fact-Check', icon: <CubeTransparentIcon className="h-6 w-6" /> },
];

const advancedTools: NavMode[] = [
    { id: 'spread', name: 'Spread Visualizer', icon: <GlobeAltIcon className="h-6 w-6" /> },
];

const training: NavMode[] = [
    { id: 'challenge', name: 'Truth Defender', icon: <PuzzlePieceIcon className="h-6 w-6" /> },
];


const NavItem: React.FC<{mode: NavMode, isActive: boolean, onClick: () => void}> = ({ mode, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`relative flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 text-left group
        ${ isActive
            ? 'text-white'
            : 'text-gray-400 hover:text-white'
        }`}
    >
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_10px_theme(colors.cyan.400)] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className={`transition-all duration-300 ${isActive ? 'translate-x-1' : ''}`}>
             <div className={isActive ? 'text-cyan-300' : ''}>{mode.icon}</div>
        </div>
        <span className={`ml-3 font-semibold transition-all duration-300 ${isActive ? 'translate-x-1' : ''}`}>{mode.name}</span>
    </button>
);


const Sidebar: React.FC<SidebarProps> = ({ currentMode, onSelectMode, onShowSplash }) => {
  return (
    <aside className="w-64 h-screen bg-black/30 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col flex-shrink-0 sticky top-0">
        <button onClick={onShowSplash} className="flex items-center gap-2 px-2 mb-8 group">
            <RealityShieldLogo className="h-8 w-8 group-hover:scale-110 transition-transform" />
            <span className="font-clash text-2xl font-semibold group-hover:text-cyan-300 transition-colors">RealityShield</span>
        </button>
        <nav className="flex-grow flex flex-col space-y-2">
            <div>
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Core Analysis</h3>
                {coreAnalysis.map(mode => <NavItem key={mode.id} mode={mode} isActive={currentMode === mode.id} onClick={() => onSelectMode(mode.id)} />)}
            </div>
             <div className="pt-4">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Advanced Tools</h3>
                {advancedTools.map(mode => <NavItem key={mode.id} mode={mode} isActive={currentMode === mode.id} onClick={() => onSelectMode(mode.id)} />)}
            </div>
             <div className="pt-4">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Training</h3>
                {training.map(mode => <NavItem key={mode.id} mode={mode} isActive={currentMode === mode.id} onClick={() => onSelectMode(mode.id)} />)}
            </div>
        </nav>
    </aside>
  );
};

export default Sidebar;