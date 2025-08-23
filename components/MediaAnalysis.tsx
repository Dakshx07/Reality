import React, { useState, useCallback, useContext } from 'react';
import { analyzeMedia } from '../services/geminiService';
import type { MediaAnalysisResult } from '../types';
import { ArrowUpTrayIcon, ShieldCheckIcon, ShieldExclamationIcon } from './Icons';

const TelemetryData: React.FC<{label: string, value: string, color?: string}> = ({label, value, color = 'text-cyan-300'}) => (
    <div>
        <p className="text-sm text-gray-500 font-mono tracking-widest">{label}</p>
        <p className={`text-2xl font-clash font-semibold ${color} animate-flicker-fast`}>{value}</p>
    </div>
);

const MediaAnalysis: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MediaAnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      handleAnalyze(selectedFile, reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleAnalyze = async (fileToAnalyze: File, dataUrl: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const base64Data = dataUrl.split(',')[1];
      const analysisResult = await analyzeMedia(base64Data, fileToAnalyze.type);
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  }
  
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
       processFile(e.dataTransfer.files[0]);
    }
  }

  return (
    <div>
      <h1 className="font-clash text-5xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Specimen Analysis</h1>
      <p className="text-xl text-gray-400 mb-8">Isolate and analyze media files for signs of AI manipulation.</p>

      {!preview && (
          <label
              onDragOver={onDragOver}
              onDrop={onDrop}
              className="mt-8 flex flex-col items-center justify-center w-full h-80 px-4 transition bg-black/20 backdrop-blur-lg border-2 border-white/10 border-dashed rounded-2xl appearance-none cursor-pointer hover:border-cyan-400 focus:outline-none">
              <ArrowUpTrayIcon className="w-16 h-16 text-gray-500" />
              <span className="mt-4 font-medium text-gray-400 text-lg">
                  Drop files to containment field, or <span className="text-cyan-400 underline">browse</span>
              </span>
              <p className="text-sm text-gray-500 mt-2">Supports images and videos</p>
              <input type="file" name="file_upload" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
          </label>
        )}

      {preview && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left Telemetry */}
            <div className="space-y-6 text-right">
                {result && !isLoading && (
                    <>
                        <TelemetryData label="ASSESSMENT" value={result.isDeepfake ? 'DEEPFAKE' : 'AUTHENTIC'} color={result.isDeepfake ? 'text-red-400' : 'text-green-400'} />
                        <TelemetryData label="CONFIDENCE" value={`${result.confidence}%`} />
                    </>
                )}
            </div>
          
            {/* Center Containment Field */}
            <div className="relative w-full aspect-square bg-black/20 rounded-2xl overflow-hidden border border-white/10 p-4">
                {file?.type.startsWith('video/') ? (
                <video src={preview} controls className="w-full h-full object-contain" />
                ) : (
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                )}

                {isLoading && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
                    <svg className="animate-spin h-10 w-10 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-white font-semibold text-xl">Scanning...</p>
                </div>
                )}
            </div>
            
            {/* Right Telemetry */}
            <div className="space-y-6">
                {result && !isLoading && (
                    <>
                        <TelemetryData label="PRIMARY INDICATOR" value={result.reasoning} />
                        <TelemetryData label="FILE TYPE" value={file?.type || 'N/A'} />
                    </>
                )}
            </div>
        </div>
      )}
       {error && <div className="mt-4 p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-md">{error}</div>}
    </div>
  );
};

export default MediaAnalysis;