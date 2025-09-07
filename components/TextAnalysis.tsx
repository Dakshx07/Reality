
import React, { useState, useEffect } from 'react';
import { analyzeText } from '../services/geminiService';
import type { TextAnalysisResult, AnalysisHistoryItem } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import AnimatedText from './ui/AnimatedText';
import Tooltip from './ui/Tooltip';
import { SparklesIcon, DocumentTextIcon, BrainIcon, ShieldCheckIcon, TagIcon, EyeIcon, InformationCircleIcon, PlusIcon, ClockIcon, TrashIcon, FaceSmileIcon, ChatBubbleBottomCenterTextIcon, AcademicCapIcon } from './Icons';
import CircularProgress from './ui/CircularProgress';

const tagColorMap: { [key: string]: string } = {
  'fear-mongering': 'bg-red-500/20 border-red-500 text-red-300',
  'fake-health-cures': 'bg-green-500/20 border-green-500 text-green-300',
  'financial-scams': 'bg-yellow-500/20 border-yellow-500 text-yellow-300',
  'whataboutism': 'bg-blue-500/20 border-blue-500 text-blue-300',
  'ad-hominem': 'bg-purple-500/20 border-purple-500 text-purple-300',
  'default': 'bg-gray-500/20 border-gray-500 text-gray-300',
};

const DataPod: React.FC<{title: string, icon?: React.ReactNode, children: React.ReactNode, className?: string}> = ({title, icon, children, className = ''}) => (
    <div className={`bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6 relative overflow-hidden ${className}`}>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_rgba(0,169,255,0.08),transparent_40%)]"></div>
        <div className="relative z-10">
            <h3 className="text-xl font-clash font-semibold text-gray-50 mb-4 flex items-center">
                {icon && <span className="mr-3 text-cyan-400">{icon}</span>}
                <span>{title}</span>
            </h3>
            {children}
        </div>
    </div>
);

const AnalysisCore: React.FC = () => {
    const analysisSteps = [
        'Scanning for linguistic bias...',
        'Cross-referencing sources...',
        'Identifying rhetorical devices...',
        'Analyzing emotional sentiment...',
        'Detecting logical fallacies...',
        'Finalizing credibility score...'
    ];
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep(prev => (prev + 1) % analysisSteps.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full flex flex-col items-center justify-center bg-black/20 border border-white/10 rounded-2xl p-8 my-8 text-center animate-fade-in">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full bg-cyan-900 animate-ai-core-pulse"></div>
                <BrainIcon className="absolute inset-0 m-auto w-12 h-12 text-cyan-300" />
            </div>
            <h3 className="mt-4 text-2xl font-clash font-semibold text-white">AI Core Analyzing</h3>
            <p className="text-gray-400 h-6 mt-1 transition-all duration-300">
                {analysisSteps[currentStep]}
            </p>
        </div>
    );
};

const InsufficientTextResult: React.FC<{ originalText: string }> = ({ originalText }) => (
    <div className="mt-8 space-y-8 animate-fade-in">
        <DataPod title="Analysis Incomplete" icon={<InformationCircleIcon className="w-6 h-6"/>}>
            <p className="text-lg text-gray-300">
                The provided text is too short or lacks sufficient substance for a comprehensive analysis.
            </p>
            <p className="mt-2 text-gray-400">
                RealityShield requires more context to accurately assess bias, detect propaganda, and provide a meaningful credibility score. Please provide a longer text passage, such as a news article or social media post, for a full analysis.
            </p>
        </DataPod>
        <DataPod title="Original Input" icon={<DocumentTextIcon className="w-6 h-6"/>}>
            <p className="text-gray-400 text-lg leading-relaxed max-h-96 overflow-y-auto pr-2">{originalText}</p>
        </DataPod>
    </div>
);

const AnalysisResultTabs: React.FC<{
    originalText: string;
    highlightedHtml: { __html: string };
    onHighlightHover: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave: () => void;
}> = ({ originalText, highlightedHtml, onHighlightHover, onMouseLeave }) => {
    const [activeTab, setActiveTab] = useState<'debrief' | 'original'>('debrief');

    return (
        <DataPod title="Detailed Debrief" icon={<EyeIcon className="w-6 h-6"/>}>
            <div className="border-b border-white/10 mb-4">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('debrief')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-lg transition-colors ${
                            activeTab === 'debrief'
                                ? 'border-cyan-400 text-cyan-300'
                                : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                        }`}
                    >
                        Highlighted Debrief
                    </button>
                    <button
                        onClick={() => setActiveTab('original')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-lg transition-colors ${
                            activeTab === 'original'
                                ? 'border-cyan-400 text-cyan-300'
                                : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                        }`}
                    >
                        Original Input
                    </button>
                </nav>
            </div>
            <div>
                {activeTab === 'original' && (
                    <p className="text-gray-400 text-lg leading-relaxed max-h-96 overflow-y-auto pr-2 animate-fade-in">{originalText}</p>
                )}
                {activeTab === 'debrief' && (
                    <div
                        className="text-gray-200 text-lg leading-relaxed prose-invert max-h-96 overflow-y-auto pr-2 animate-fade-in"
                        dangerouslySetInnerHTML={highlightedHtml}
                        onMouseMove={onHighlightHover}
                        onMouseLeave={onMouseLeave}
                    />
                )}
            </div>
        </DataPod>
    );
};

const AnalysisHistorySidebar: React.FC<{
    history: AnalysisHistoryItem[];
    selectedId: number | null;
    onSelect: (item: AnalysisHistoryItem) => void;
    onDelete: (e: React.MouseEvent, id: number) => void;
    onNew: () => void;
    onClearAll: () => void;
}> = ({ history, selectedId, onSelect, onDelete, onNew, onClearAll }) => {
    
    const handleClearConfirm = () => {
        if (window.confirm('Are you sure you want to delete all analysis history? This action cannot be undone.')) {
            onClearAll();
        }
    };

    return (
        <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-4 h-full sticky top-28">
            <button
                onClick={onNew}
                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors mb-4"
            >
                <PlusIcon className="w-5 h-5" />
                New Analysis
            </button>
            <h3 className="text-lg font-clash font-semibold text-gray-50 mb-3 flex items-center gap-2 px-2">
                <ClockIcon className="w-6 h-6 text-cyan-400" />
                Analysis History
            </h3>
            <div className="max-h-[calc(100vh-26rem)] overflow-y-auto pr-1">
                {history.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm p-4">No history yet. Your analyses will appear here.</p>
                ) : (
                    <ul className="space-y-2">
                        {history.map(item => (
                            <li key={item.id}>
                                <button
                                    onClick={() => onSelect(item)}
                                    className={`w-full text-left p-3 rounded-lg group transition-colors ${selectedId === item.id ? 'bg-cyan-500/10' : 'hover:bg-white/5'}`}
                                >
                                    <p className="font-semibold text-gray-200 text-sm truncate">{item.inputText}</p>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
                                        <button 
                                            onClick={(e) => onDelete(e, item.id)}
                                            className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1 rounded-full hover:bg-red-500/10"
                                            aria-label="Delete analysis"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {history.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                    <button
                        onClick={handleClearConfirm}
                        className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:bg-red-500/10 font-semibold py-2 px-3 rounded-lg transition-colors"
                        aria-label="Clear all analysis history"
                    >
                        <TrashIcon className="w-4 h-4" />
                        Clear All History
                    </button>
                </div>
            )}
        </div>
    );
};

const SentimentMeter: React.FC<{ score: number; label: string }> = ({ score, label }) => {
    const percentage = (score + 1) / 2 * 100;
    const color = score < -0.2 ? 'bg-red-500' : score > 0.2 ? 'bg-green-500' : 'bg-yellow-500';

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-300">{label}</span>
                <span className="font-mono text-sm text-gray-400">{score.toFixed(2)}</span>
            </div>
            <div className="w-full bg-neutral-700 rounded-full h-2.5 relative overflow-hidden">
                 <div className="absolute top-0 left-1/2 w-px h-full bg-neutral-500"></div>
                <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    )
}


const TextAnalysis: React.FC = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TextAnalysisResult | null>(null);
  const [hoveredTechnique, setHoveredTechnique] = useState<string | null>(null);

  const [history, setHistory] = useLocalStorage<AnalysisHistoryItem[]>('textAnalysisHistory', []);
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);

  const [lastAnalysis, setLastAnalysis] = useState<TextAnalysisResult | null>(null);


  // Effect to add a new analysis to history
  useEffect(() => {
    // This effect runs when `lastAnalysis` changes
    if (lastAnalysis && !lastAnalysis.insufficientText) {
      const newHistoryItem: AnalysisHistoryItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        inputText: text,
        result: lastAnalysis,
      };
      // Prepend to history and update state
      setHistory(prevHistory => [newHistoryItem, ...prevHistory]);
      setSelectedHistoryId(newHistoryItem.id);
    }
  }, [lastAnalysis]);


  const handleNewAnalysis = () => {
    setResult(null);
    setText('');
    setSelectedHistoryId(null);
    setError(null);
  };

  const handleSelectHistory = (item: AnalysisHistoryItem) => {
    setResult(item.result);
    setText(item.inputText);
    setSelectedHistoryId(item.id);
    setError(null);
    setIsLoading(false);
  };

  const handleDeleteHistory = (e: React.MouseEvent, idToDelete: number) => {
    e.stopPropagation();
    const newHistory = history.filter(item => item.id !== idToDelete);
    setHistory(newHistory);
    if (selectedHistoryId === idToDelete) {
      handleNewAnalysis();
    }
  };
  
  const handleClearHistory = () => {
    setHistory([]);
    handleNewAnalysis();
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLastAnalysis(null);
    setSelectedHistoryId(null);
    try {
      const analysisResult = await analyzeText(text);
      setResult(analysisResult);
       // Set this state to trigger the history-saving effect
      setLastAnalysis(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const createHighlightedHTML = (htmlString: string) => {
    const processedHtml = htmlString.replace(/<mark class='(.*?)'>/g, (match, p1) => {
      const isHovered = p1 === hoveredTechnique;
      const pulseClass = isHovered ? 'animate-highlight-pulse' : '';
      const colorClass = tagColorMap[p1] || tagColorMap['default'];
      return `<mark class='${colorClass} rounded px-1 transition-all ${pulseClass}' data-technique='${p1}'>`;
    });
    return { __html: processedHtml };
  };

  const handleHighlightHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'MARK' && target.dataset.technique) {
      setHoveredTechnique(target.dataset.technique);
    } else {
      setHoveredTechnique(null);
    }
  };


  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* History Sidebar */}
      <div className="lg:col-span-1">
        <AnalysisHistorySidebar 
            history={history}
            selectedId={selectedHistoryId}
            onSelect={handleSelectHistory}
            onDelete={handleDeleteHistory}
            onNew={handleNewAnalysis}
            onClearAll={handleClearHistory}
        />
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        <h1 className="font-clash text-5xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Text Analysis Console</h1>
        <p className="text-xl text-gray-400 mb-8">Input text to dissect propaganda, bias, and manipulation techniques.</p>
        
        <DataPod title="Command Input" icon={<DocumentTextIcon className="w-6 h-6"/>}>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste news articles, social media posts, or any text here..."
                className="w-full h-48 p-4 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all text-lg shadow-inner resize-y disabled:bg-white/5"
                disabled={isLoading || selectedHistoryId !== null}
                readOnly={selectedHistoryId !== null}
            />
            <button
                onClick={handleAnalyze}
                disabled={isLoading || selectedHistoryId !== null}
                className="mt-4 w-full flex items-center justify-center bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-500 disabled:bg-neutral-700 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? 'Analyzing...' : 'Analyze Text'}
            </button>
            {error && <div className="mt-4 p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-md">{error}</div>}
        </DataPod>

        {isLoading && <AnalysisCore />}

        {result && !isLoading && (
          result.insufficientText ? (
              <InsufficientTextResult originalText={text} />
          ) : (
          <div className="mt-8 space-y-8 animate-fade-in">
              <DataPod title="Executive Summary" icon={<SparklesIcon className="w-6 h-6"/>}>
                  <AnimatedText text={result.summary} className="text-lg"/>
              </DataPod>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DataPod title="Linguistic & Sentiment Analysis" icon={<FaceSmileIcon className="w-6 h-6"/>}>
                    <div className="space-y-4">
                         <div>
                            <h4 className="text-gray-300 font-semibold mb-2">Overall Tone</h4>
                             <div className="flex flex-wrap gap-2">
                                {result.tone.map(t => <span key={t} className="px-2.5 py-1 text-sm font-medium rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">{t}</span>)}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-gray-300 font-semibold mb-2">Sentiment</h4>
                            <SentimentMeter score={result.sentiment.score} label={result.sentiment.label} />
                        </div>
                    </div>
                </DataPod>

                <DataPod title="Key Claims & Fact-Check" icon={<ChatBubbleBottomCenterTextIcon className="w-6 h-6"/>}>
                    <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                        {result.keyClaims.length > 0 ? (
                            result.keyClaims.map((claim, index) => (
                                <div key={index} className="bg-black/20 p-3 rounded-md border border-white/10">
                                    <p className="text-gray-300">"{claim.claim}"</p>
                                    {claim.verifiable ? (
                                        <a href={`https://www.google.com/search?q=${encodeURIComponent(claim.claim)}`} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline hover:text-cyan-300 transition-colors font-semibold">
                                            Verify on Google &rarr;
                                        </a>
                                    ) : (
                                        <p className="text-sm text-gray-500 font-semibold">Opinion / Unverifiable</p>
                                    )}
                                </div>
                            ))
                        ) : (
                             <p className="text-gray-400">No specific factual claims were identified for verification.</p>
                        )}
                    </div>
                </DataPod>
              </div>

              <DataPod title="Threat Vector Analysis" icon={<ShieldCheckIcon className="w-6 h-6"/>}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                      <div className="md:col-span-1 flex flex-col items-center">
                          <h4 className="text-gray-300 font-semibold mb-3">Bias & Credibility Score</h4>
                          <CircularProgress score={result.biasScore} size="large" />
                          <div className="text-center mt-2">
                              <p className="text-sm font-semibold text-gray-400">
                                  {result.insufficientText ? 'Undetermined' : result.biasScore < 40 ? 'High Bias' : result.biasScore < 70 ? 'Moderate Bias' : 'Low Bias / Neutral'}
                              </p>
                          </div>
                      </div>
                      <div className="md:col-span-2 space-y-6">
                          <div>
                              <h4 className="text-gray-300 font-semibold flex items-center gap-2 mb-3"><TagIcon className="w-5 h-5"/> Detected Propaganda</h4>
                              {result.tags.length > 0 ? (
                                  <div className="flex flex-wrap gap-3">
                                  {result.tags.map((tag) => {
                                      const className = tag.technique.toLowerCase().replace(/\s+/g, '-');
                                      const colorClass = tagColorMap[className] || tagColorMap['default'];
                                      const isHovered = className === hoveredTechnique;
                                      return (
                                      <Tooltip key={tag.technique} text={tag.description}>
                                          <span 
                                              onMouseEnter={() => setHoveredTechnique(className)}
                                              onMouseLeave={() => setHoveredTechnique(null)}
                                              className={`px-3 py-1 text-base font-semibold rounded-full border cursor-pointer transition-all ${colorClass} ${isHovered ? 'scale-110 shadow-lg' : ''}`}>
                                          {tag.technique}
                                          </span>
                                      </Tooltip>
                                      );
                                  })}
                                  </div>
                              ) : (
                                  <p className="text-gray-400">No specific propaganda techniques were detected.</p>
                              )}
                          </div>
                          <div>
                              <h4 className="text-gray-300 font-semibold mb-3">Potential Flags & Sources</h4>
                              {result.flags && result.flags.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                      {result.flags.map(flag => <span key={flag} className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-800/50 text-yellow-200 border border-yellow-600/50">{flag}</span>)}
                                  </div>
                              ) : <p className="text-sm text-gray-500">No major bias flags detected.</p>}
                              
                              {result.alternatives && result.alternatives.length > 0 ? (
                                  <div className="flex flex-col gap-2 mt-4">
                                      {result.alternatives.map(alt => (
                                          <a href={alt.url} key={alt.name} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline hover:text-cyan-300 bg-cyan-900/20 px-3 py-1.5 rounded-md transition-colors">
                                              Alternative Source: {alt.name} &rarr;
                                          </a>
                                      ))}
                                  </div>
                              ) : (
                                  result.flags.length === 0 && <p className="text-sm text-gray-500 mt-2">No alternative sources found.</p>
                              )}
                          </div>
                      </div>
                  </div>
              </DataPod>

                <DataPod title="Advanced Linguistic Analysis" icon={<AcademicCapIcon className="w-6 h-6"/>}>
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-gray-300 font-semibold mb-3">Logical Fallacies</h4>
                            {result.logicalFallacies && result.logicalFallacies.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                {result.logicalFallacies.map((fallacy) => (
                                    <Tooltip key={fallacy.fallacy} text={fallacy.description}>
                                        <span className="px-3 py-1 text-base font-semibold rounded-full border cursor-pointer transition-all bg-purple-500/20 border-purple-500/30 text-purple-300">
                                            {fallacy.fallacy}
                                        </span>
                                    </Tooltip>
                                ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">No specific logical fallacies were detected.</p>
                            )}
                        </div>
                        {result.readability && (
                        <div>
                            <h4 className="text-gray-300 font-semibold mb-2">Readability Analysis</h4>
                            <div className="bg-black/20 p-4 rounded-md border border-white/10 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                                <div className="text-center">
                                    <p className="text-sm text-gray-400">Flesch Score</p>
                                    <p className="text-3xl font-bold font-clash text-cyan-300">{result.readability.score.toFixed(1)}</p>
                                </div>
                                <div className="text-center border-y md:border-y-0 md:border-x border-white/10 py-4 md:py-0">
                                    <p className="text-sm text-gray-400">Reading Level</p>
                                    <p className="text-lg font-semibold text-gray-200">{result.readability.level}</p>
                                </div>
                                <div className="text-sm text-gray-500 text-center md:text-left">
                                    Higher scores indicate easier readability. A score of 60-70 is easily understood by 13-15 year olds.
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </DataPod>

              <AnalysisResultTabs 
                  originalText={text}
                  highlightedHtml={createHighlightedHTML(result.highlightedText)}
                  onHighlightHover={handleHighlightHover}
                  onMouseLeave={() => setHoveredTechnique(null)}
              />
          </div>
          )
        )}
      </div>
    </div>
  );
};

export default TextAnalysis;
