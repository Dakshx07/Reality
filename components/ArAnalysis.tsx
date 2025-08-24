
import React, { useState, useEffect, useRef, useContext } from 'react';
import type { ArDetectionResult } from '../types';
import { CameraIcon, CheckCircleIcon } from './Icons';
import CircularProgress from './ui/CircularProgress';

const ArAnalysis: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ArDetectionResult | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const enableCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } catch (err) {
        setError('Camera access denied. Please enable camera permissions for this site.');
        setIsCameraActive(false);
      }
    };

    if(isCameraActive){
        enableCamera();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  const handleScan = () => {
    setIsScanning(true);
    setResult(null);

    setTimeout(() => {
        const scanResult: ArDetectionResult = {
            score: 12,
            summary: "Claimed 'Miracle Cure' Debunked",
            source: "Source: World Health Organization, June 2024",
            confidence: 98,
            reasoning: "The claim matches a known and widely debunked health misinformation campaign."
        };
        setResult(scanResult);
        setIsScanning(false);
    }, 2500);
  };
  
  const CameraActivationCard = () => (
     <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center max-w-2xl mx-auto mt-10">
         <h1 className="font-clash text-5xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">AR Fact-Check</h1>
         <p className="text-xl text-gray-400 mb-6">Activate your camera to scan real-world objects for known misinformation.</p>
         <CameraIcon className="w-24 h-24 text-neutral-700 my-4"/>
         {error && <div className="mb-4 p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-md">{error}</div>}
         <button onClick={() => setIsCameraActive(true)} className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-cyan-500 transition-colors text-lg">
            Activate Camera
         </button>
    </div>
  )
  
  if (!isCameraActive) {
    return <CameraActivationCard />;
  }

  return (
    <div>
      <h1 className="font-clash text-5xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">AR Live Feed</h1>
      <p className="text-xl text-gray-400 mb-8">Point camera at an object and press 'Simulate Scan' to begin analysis.</p>

      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-white/10 max-w-4xl mx-auto">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        
        {/* HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none border-8 border-cyan-400/20 rounded-lg">
             <div className="absolute top-4 left-4 text-cyan-300 text-xs font-mono">REC ● LIVE FEED</div>
             <div className="absolute bottom-4 right-4 text-cyan-300 text-xs font-mono">CAM_ENV_01 / ACTIVE</div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 border-2 border-cyan-400/50">
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
             </div>
        </div>

        {isScanning && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                <div className="w-48 h-48 border-4 border-cyan-400 border-dashed rounded-lg animate-spin"></div>
                <p className="mt-4 text-white font-semibold text-lg">SCANNING...</p>
            </div>
        )}
      </div>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="mt-6 w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-500 disabled:bg-neutral-700 disabled:cursor-not-allowed transition-colors text-lg"
        >
          {isScanning ? 'Scanning...' : 'Simulate Scan'}
        </button>

        {result && (
             <div className="mt-8 bg-black/50 backdrop-blur-md p-6 rounded-xl border border-cyan-500/50 shadow-lg animate-fade-in-up">
                  <div className="flex items-center">
                      <div className="flex-shrink-0">
                          <CircularProgress score={result.score} size="large" />
                      </div>
                      <div className="ml-6">
                          <p className="font-clash text-xl text-gray-400">Credibility Score</p>
                          <h3 className="text-3xl font-semibold text-red-500">{result.summary}</h3>
                          <p className="text-md text-gray-300 mt-2 flex items-center"><CheckCircleIcon className="w-5 h-5 mr-2 text-green-400"/> {result.source}</p>
                      </div>
                  </div>
              </div>
        )}
      </div>
    </div>
  );
};

export default ArAnalysis;