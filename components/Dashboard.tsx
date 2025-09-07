
import React, { useState } from 'react';
import type { AnalysisMode } from '../types';
import ModeSelector from './ModeSelector'; // This is now the Sidebar
import TextAnalysis from './TextAnalysis';
import MediaAnalysis from './MediaAnalysis';
import ArAnalysis from './ArAnalysis';
import SpreadVisualization from './SpreadVisualization';
import ChallengeMode from './ChallengeMode';
import Leaderboard from './Leaderboard';
import DailyDebunker from './DailyDebunker';

interface DashboardProps {
  showSplash: () => void;
}

const componentMap: Record<AnalysisMode, React.FC<any>> = {
    challenge: ChallengeMode,
    text: TextAnalysis,
    media: MediaAnalysis,
    ar: ArAnalysis,
    spread: SpreadVisualization,
    leaderboard: Leaderboard,
    debunker: DailyDebunker,
};

const Dashboard: React.FC<DashboardProps> = ({ showSplash }) => {
  const [mode, setMode] = useState<AnalysisMode>('text');
  
  const ActiveComponent = componentMap[mode];

  return (
    <div className="min-h-screen flex w-full relative">
      <div className="absolute inset-0 bg-neutral-900/50 hud-grid"></div>
      <ModeSelector 
        currentMode={mode} 
        onSelectMode={setMode}
        onShowSplash={showSplash}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative [perspective:1200px]">
        <div key={mode} className="w-full max-w-6xl mx-auto animate-panel-enter">
             <ActiveComponent />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
