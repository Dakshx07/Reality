
import React, { useState } from 'react';
import { InformationCircleIcon } from '../Icons';

interface EthicalAiMeterProps {
  confidence: number;
  reasoning: string;
  limitations: string[];
}

const EthicalAiMeter: React.FC<EthicalAiMeterProps> = ({ confidence, reasoning, limitations }) => {
  const [isOpen, setIsOpen] = useState(false);

  const confidenceColor = confidence < 50 ? 'bg-red-500' : confidence < 85 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="border border-gray-700 rounded-lg bg-gray-900/50 p-4 mb-4">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left">
        <div className="flex items-center">
            <InformationCircleIcon className="w-6 h-6 mr-2 text-cyan-400" />
            <h4 className="font-orbitron font-bold text-lg text-gray-200">How We Know</h4>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-4 space-y-4 animate-fade-in">
          <div>
            <label className="text-sm font-semibold text-gray-400">Confidence Meter</label>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
              <div className={`${confidenceColor} h-2.5 rounded-full`} style={{ width: `${confidence}%` }}></div>
            </div>
            <p className="text-right text-sm font-bold text-gray-200 mt-1">{confidence}%</p>
          </div>
           <div>
            <h5 className="text-sm font-semibold text-gray-400">Simplified Reasoning</h5>
            <p className="text-gray-300 text-sm mt-1">{reasoning}</p>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-gray-400">Limitations</h5>
            <ul className="list-disc list-inside text-gray-300 text-sm mt-1 space-y-1">
                {limitations.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default EthicalAiMeter;