import React, { useState, useEffect, useRef } from 'react';
import useOnScreen from '../../hooks/useOnScreen';

const sampleText = "URGENT WARNING: This 'miracle cure' is being hidden from you by elites, leading to a potential end-of-world scenario!".split(' ');

const tagMap: { [key: number]: { text: string; className: string } } = {
    4: { text: "FAKE CURE", className: 'bg-green-500/10 text-green-300 border-green-500/30' },
    15: { text: "FEAR-MONGERING", className: 'bg-red-500/10 text-red-300 border-red-500/30' }
};

const MisinfoDnaDemo: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref, '-200px');
    const [scannedIndex, setScannedIndex] = useState(-1);
    
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (isVisible) {
            setScannedIndex(-1);
            interval = setInterval(() => {
                setScannedIndex(prev => {
                    if (prev >= sampleText.length) {
                        clearInterval(interval);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 80);
        } else {
             setScannedIndex(-1);
        }
        return () => clearInterval(interval);
    }, [isVisible]);
    
    return (
         <div ref={ref} className="w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            <div className={`transition-opacity duration-1000 lg:order-2 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <p className="font-clash text-lg font-medium text-cyan-400">MISINFORMATION DNA</p>
                <h3 className="font-clash font-semibold text-5xl text-gray-200 mt-2">Uncover Hidden Agendas.</h3>
                <p className="text-gray-400 text-lg mt-4">Deconstruct text to identify underlying propaganda techniques and rhetorical fallacies. See how narratives are built to manipulate.</p>
            </div>
             <div 
                className={`relative p-6 lg:p-8 aspect-video rounded-2xl transition-all duration-700 ease-out bg-white/5 backdrop-blur-xl border border-white/10 lg:order-1 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
            >
                <div className="text-xl md:text-2xl text-gray-400 leading-relaxed">
                    {sampleText.map((word, index) => {
                        const tag = tagMap[index];
                        if (tag && index <= scannedIndex) {
                            return (
                                <span key={index} className={`px-2 py-1 text-base font-semibold rounded-md border inline-block mx-1 ${tag.className}`} style={{ animation: 'glitch-in 0.3s both' }}>
                                    {tag.text}
                                </span>
                            );
                        }
                         if ((index >= 4 && index <= 5) && index <= scannedIndex) return null;
                         if ((index >= 15 && index <= 18) && index <= scannedIndex) return null;
                        
                        return (
                            <span key={index} className={`transition-colors duration-300 ${index <= scannedIndex ? 'text-white' : 'text-neutral-600'}`}>
                                {word}{' '}
                            </span>
                        );
                    })}
                </div>
                 {/* Scanner Line */}
                <div 
                    className="absolute top-0 left-0 w-1 h-full bg-cyan-400/80 shadow-[0_0_10px_theme(colors.cyan.400),0_0_20px_theme(colors.cyan.400)] transition-transform duration-1000 ease-out"
                    style={{ 
                      transform: isVisible ? `translateX(${scannedIndex / sampleText.length * 500}%)` : 'translateX(0)',
                      opacity: scannedIndex >= sampleText.length || !isVisible ? 0 : 1
                    }}
                 ></div>
            </div>
        </div>
    );
};

export default MisinfoDnaDemo;