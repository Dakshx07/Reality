
import React, { useState, useEffect } from 'react';
import { analyzeText } from '../services/geminiService';
import type { TextAnalysisResult } from '../types';
import AnimatedText from './ui/AnimatedText';
import Tooltip from './ui/Tooltip';
import { SparklesIcon, DocumentTextIcon, BrainIcon, ShieldCheckIcon, TagIcon, EyeIcon } from './Icons';
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
    <div className={`bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6 relative overflow-hidden animate-panel-enter ${className}`}>
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


const TextAnalysis: React.FC = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TextAnalysisResult | null>(null);
  const [hoveredTechnique, setHoveredTechnique] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null); // Clear previous results immediately
    try {
      const analysisResult = await analyzeText(text);
      setResult(analysisResult);
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
    <div className="max-w-7xl mx-auto">
      <h1 className="font-clash text-5xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Text Analysis Console</h1>
      <p className="text-xl text-gray-400 mb-8">Input text to dissect propaganda, bias, and manipulation techniques.</p>
      
      <DataPod title="Command Input" icon={<DocumentTextIcon className="w-6 h-6"/>}>
          <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste news articles, social media posts, or any text here..."
              className="w-full h-48 p-4 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all text-lg shadow-inner resize-y"
              disabled={isLoading}
          />
          <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="mt-4 w-full flex items-center justify-center bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-500 disabled:bg-neutral-700 disabled:cursor-not-allowed transition-colors"
          >
              {isLoading ? 'Analyzing...' : 'Analyze Text'}
          </button>
          {error && <div className="mt-4 p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-md">{error}</div>}
      </DataPod>

      {isLoading && <AnalysisCore />}

      {result && !isLoading && (
        <div className="mt-8 space-y-8 animate-fade-in">
            <DataPod title="Executive Summary" icon={<SparklesIcon className="w-6 h-6"/>}>
                <AnimatedText text={result.summary} className="text-lg"/>
            </DataPod>

            <DataPod title="Threat Vector Analysis" icon={<ShieldCheckIcon className="w-6 h-6"/>}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <div className="md:col-span-1 flex flex-col items-center">
                        <h4 className="font-semibold text-gray-300 mb-2">Bias & Credibility Score</h4>
                        <CircularProgress score={result.biasScore} size="large" />
                        <div className="text-center mt-2">
                            <p className="text-sm font-semibold text-gray-400">
                                {result.biasScore < 40 ? 'High Bias' : result.biasScore < 70 ? 'Moderate Bias' : 'Low Bias / Neutral'}
                            </p>
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h4 className="font-semibold text-gray-300 flex items-center gap-2 mb-2"><TagIcon className="w-5 h-5"/> Detected Propaganda</h4>
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
                            <h4 className="font-semibold text-gray-300 mb-2">Potential Flags & Sources</h4>
                            {result.flags && result.flags.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {result.flags.map(flag => <span key={flag} className="px-2.5 py-1 text-sm font-medium rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/30">{flag}</span>)}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <DataPod title="Original Input" icon={<DocumentTextIcon className="w-6 h-6"/>}>
                    <p className="text-gray-400 text-lg leading-relaxed max-h-96 overflow-y-auto pr-2">{text}</p>
                </DataPod>
                <DataPod title="Highlighted Debrief" icon={<EyeIcon className="w-6 h-6"/>}>
                    <div
                        className="text-gray-200 text-lg leading-relaxed prose-invert max-h-96 overflow-y-auto pr-2"
                        dangerouslySetInnerHTML={createHighlightedHTML(result.highlightedText)}
                        onMouseMove={handleHighlightHover}
                        onMouseLeave={() => setHoveredTechnique(null)}
                    />
                </DataPod>
            </div>
        </div>
      )}
    </div>
  );
};

export default TextAnalysis;