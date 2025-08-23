import React, { useState, useContext } from 'react';
import { analyzeText } from '../services/geminiService';
import type { TextAnalysisResult } from '../types';
import AnimatedText from './ui/AnimatedText';
import Tooltip from './ui/Tooltip';
import { SparklesIcon } from './Icons';
import Skeleton from './ui/Skeleton';
import BiasScanner from './ui/BiasScanner';

const tagColorMap: { [key: string]: string } = {
  'fear-mongering': 'bg-red-500/20 border-red-500 text-red-300',
  'fake-health-cures': 'bg-green-500/20 border-green-500 text-green-300',
  'financial-scams': 'bg-yellow-500/20 border-yellow-500 text-yellow-300',
  'whataboutism': 'bg-blue-500/20 border-blue-500 text-blue-300',
  'ad-hominem': 'bg-purple-500/20 border-purple-500 text-purple-300',
  'default': 'bg-gray-500/20 border-gray-500 text-gray-300',
};

const DataPod: React.FC<{title: string, icon?: React.ReactNode, children: React.ReactNode, className?: string}> = ({title, icon, children, className}) => (
    <div className={`bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6 relative overflow-hidden ${className}`}>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_rgba(0,169,255,0.1),transparent_40%)]"></div>
        <div className="relative z-10">
            <h3 className="text-xl font-clash font-semibold text-gray-50 mb-4 flex items-center">
                {icon && <span className="mr-3">{icon}</span>}
                <span className="animate-flicker-fast">{title}</span>
            </h3>
            {children}
        </div>
    </div>
);

const TextAnalysisSkeleton = () => (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-24 w-full" />
        </div>
        <div className="space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-40 w-full" />
        </div>
    </div>
);


const TextAnalysis: React.FC = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TextAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const analysisResult = await analyzeText(text);
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-clash text-5xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Text Analysis Console</h1>
      <p className="text-xl text-gray-400 mb-8">Input text to dissect propaganda, bias, and manipulation techniques.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Input */}
        <div className="space-y-6">
            <DataPod title="Command Input">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text here..."
                    className="w-full h-48 p-4 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all text-lg shadow-inner"
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

            {result && !isLoading && (
                <DataPod title="AI Summary" icon={<SparklesIcon className="w-6 h-6 text-yellow-400"/>}>
                    <AnimatedText text={result.summary} className="text-lg"/>
                </DataPod>
            )}

            {isLoading && (
                <div className="space-y-4">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-24 w-full" />
                </div>
            )}
        </div>

        {/* Right Column: Results */}
        <div className="space-y-6">
            {isLoading && <TextAnalysisSkeleton />}
            
            {result && !isLoading && (
                 <>
                    <DataPod title="Bias & Credibility Scan">
                        <BiasScanner 
                            score={result.biasScore}
                            flags={result.flags}
                            alternatives={result.alternatives}
                        />
                    </DataPod>

                    <DataPod title="Detected Propaganda">
                        <div className="flex flex-wrap gap-3">
                        {result.tags.map((tag) => {
                            const className = tag.technique.toLowerCase().replace(/\s+/g, '-');
                            const colorClass = tagColorMap[className] || tagColorMap['default'];
                            return (
                            <Tooltip key={tag.technique} text={tag.description}>
                                <span className={`px-3 py-1 text-base font-semibold rounded-full border ${colorClass}`}>
                                {tag.technique}
                                </span>
                            </Tooltip>
                            );
                        })}
                        </div>
                    </DataPod>
                    
                    <DataPod title="Highlighted Analysis">
                        <div
                            className="text-gray-300 text-lg leading-relaxed prose-invert max-h-60 overflow-y-auto pr-2"
                            dangerouslySetInnerHTML={{ __html: result.highlightedText.replace(/<mark class='(.*?)'>/g, (match, p1) => `<mark class='${tagColorMap[p1] || tagColorMap['default']} rounded px-1'>`) }}
                        />
                    </DataPod>
                 </>
            )}
        </div>
      </div>
    </div>
  );
};

export default TextAnalysis;